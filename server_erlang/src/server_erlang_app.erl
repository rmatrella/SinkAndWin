%%%-------------------------------------------------------------------
%% @doc server_erlang public API
%% @end
%%%-------------------------------------------------------------------

-module(server_erlang_app).

-behaviour(application).

-export([start/2, stop/1]).

start(_StartType, _StartArgs) ->
	Dispatch = cowboy_router:compile([
		{'_', [{"/ws", web_server, []}]}
	]),
	{ok, _} = cowboy:start_clear(http_listener, 
		[{port, 8090}], 
		#{env => #{dispatch => Dispatch}}
	),
	server_erlang_sup:start_link().

stop(_State) ->
    ok = cowboy:stop_listener(http_listener).

%% internal functions
