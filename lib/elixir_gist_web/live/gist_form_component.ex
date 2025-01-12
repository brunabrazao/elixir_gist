defmodule ElixirGistWeb.GistFormComponent do
  use ElixirGistWeb, :live_component
  alias ElixirGist.{Gists, Gists.Gist}

  def mount(socket) do
    socket = assign(socket, form: to_form(Gists.change_gist(%Gist{})))

    {:ok, socket}
  end

  def render(assigns) do
    ~H"""
    <div>
      <.form for={@form} phx-submit="create" phx-change="validate" phx-target={@myself}>
        <div class="justify-center px-28 w-full space-y-4 mb-10">
          <.input
            field={@form[:description]}
            placeholder="Gist description..."
            autocomplete="off"
            phx-debounce="blur"
          />
          <div>
            <div class="flex p-2 items-center bg-bbDark rounded-t-md border">
              <div class="w-[300px] mb-2">
                <.input
                  field={@form[:name]}
                  placeholder="Filename including extension..."
                  autocomplete="off"
                  phx-debounce="blur"
                />
              </div>
            </div>

            <div class="flex w-full" phx-update="ignore" id="gist-wrapper">
              <textarea id="line-numbers" class="line-numbers" readonly>
            <%= "1\n" %>
          </textarea>
              <%!-- Nothing seems to be working to pick up the css so adding html --%>
              <textarea
                id="gist_markup_text"
                phx-hook="UpdateLineNumbers"
                name="gist[markup_text]"
                class="text-area w-full rounded-br-md"
                placeholder="Insert code..."
                spellcheck="false"
                autocomplete="off"
                phx-debounce="blur"
                value={@form.data.markup_text}
              />
            </div>
          </div>
          <div class="flex justify-end">
            <.button class="create-btn" phx-disable-with="Creating...">Create gist</.button>
          </div>
        </div>
      </.form>
    </div>
    """
  end

  def handle_event("create", %{"gist" => params}, socket) do
    case Gists.create_gist(socket.assigns.current_user, params) do
      {:ok, gist} ->
        socket = push_event(socket, "clear-textareas", %{})
        change_set = Gists.change_gist(%Gist{})
        socket = assign(socket, form: to_form(change_set))
        {:noreply, push_navigate(socket, to: ~p"/gist?#{[id: gist]}")}

      {:error, %Ecto.Changeset{} = changeset} ->
        {:noreply, assign(socket, form: to_form(changeset))}
    end
  end

  def handle_event("validate", %{"gist" => params}, socket) do
    change_set =
      %Gist{}
      |> Gists.change_gist(params)
      |> Map.put(:action, :validate)

    {:noreply, assign(socket, form: to_form(change_set))}
  end
end
