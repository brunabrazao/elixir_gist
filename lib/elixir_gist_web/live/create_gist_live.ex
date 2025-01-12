defmodule ElixirGistWeb.CreateGistLive do
  # this module make this a live view
  use ElixirGistWeb, :live_view
  alias ElixirGistWeb.GistFormComponent
  alias ElixirGist.{Gists, Gists.Gist}

  def mount(_params, _session, socket) do
    {:ok, socket}
  end

  def render(assigns) do
    ~H"""
    <div class="flex items-center justify-center bb-gradient">
      <h1 class="text-white font-brand font-bold text-3xl">
        Instantly share Elixir code, notes, and snippets.
      </h1>
    </div>

    <.live_component
      module={GistFormComponent}
      id={:new}
      current_user={@current_user}
      form={to_form(Gists.change_gist(%Gist{}))}
    />
    """
  end
end
