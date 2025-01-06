defmodule ElixirGistWeb.CreateGistLive do
  # this module make this a live view
  import Phoenix.HTML.Form
  use ElixirGistWeb, :live_view
  alias ElixirGist.{Gists, Gists.Gist}

  def mount(_params, _session, socket) do
    socket = assign(socket, form: to_form(Gists.change_gist(%Gist{})))

    {:ok, socket}
  end
end
