defmodule ElixirGistWeb.CreateGistLive do
  # this module make this a live view
  use ElixirGistWeb, :live_view
  alias ElixirGist.{Gists, Gists.Gist}

  def mount(_params, _session, socket) do
    socket = assign(socket, form: to_form(Gists.change_gist(%Gist{})))

    {:ok, socket}
  end

  def handle_event("create", %{"gist" => params}, socket) do
    case Gists.create_gist(socket.assigns.current_user, params) do
      {:ok, _gist} ->
        change_set = Gists.change_gist(%Gist{})
        {:noreply, assign(socket, form: to_form(change_set))}

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
