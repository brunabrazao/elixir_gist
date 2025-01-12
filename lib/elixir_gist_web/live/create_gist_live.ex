defmodule ElixirGistWeb.CreateGistLive do
  # this module make this a live view
  use ElixirGistWeb, :live_view
  alias ElixirGistWeb.GistFormComponent

  def mount(_params, _session, socket) do
    {:ok, socket}
  end
end
