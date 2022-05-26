%%%-------------------------------------------------------------------
%%% @author matre
%%% @copyright (C) 2022, <COMPANY>
%%% @doc
%%%
%%% @end
%%% Created : 22. mag 2022 17:42
%%%-------------------------------------------------------------------
-module(online_users).
-author("matrella").

%% API
-export([init_main/0]).

init_main() ->
  %%online_users:start_server(),
  io:fwrite("Server starts \n"),
  Server = spawn(fun()-> main_loop([]) end),
  register(sinkandwin_server, Server),
  io:fwrite("Server registered \n").

main_loop(OnlineUsersList) ->
  io:fwrite("Main loop started \n"),
  receive
    {addUser, Username} ->
      notify_all({addUser,Username}, OnlineUsersList),
      NewListUsers = OnlineUsersList ++ [Username], %% or lists:append(OnlineUsersList, [Username])
      %%%NewListUsers = online_users:add_users(Username),
      io:format("Online users : ~p\n", [NewListUsers]),
      main_loop(NewListUsers);
    {getUser, Username} ->
      notify_one(Username, OnlineUsersList),
      io:format("Online users : ~p\n", [OnlineUsersList]),
      main_loop(OnlineUsersList);
    {delUser, Username} ->
      NewListUsers = lists:delete(Username, OnlineUsersList),
      notify_all({delUser, Username}, NewListUsers),
      io:format("Online users : ~p\n", [NewListUsers]),
      main_loop(NewListUsers);
    _ -> ok
  end,
  main_loop(OnlineUsersList).


notify_all(_, []) ->
  ok;

notify_all({addUser,CurrentUser}, [First | Others]) ->
  whereis(First) ! jsx:encode(#{<<"type">> => <<"add_user">>,
    <<"sender">> => <<"WebSocket">>,
    <<"data">> => CurrentUser}),
  %%whereis(First) ! jsx:encode(#{<<"type">> => <<"add_user">>,<<"data">> => <<"CurrentUser">>}),
  notify_all({addUser, CurrentUser}, Others);

notify_all({delUser,CurrentUser}, [First | Others]) ->
  whereis(First) ! jsx:encode(#{<<"type">> => <<"delete_user">>,<<"data">> => CurrentUser}),
  notify_all({addUser, CurrentUser}, Others).

notify_one(Username, UsersList) ->
  whereis(Username) ! jsx:encode(#{<<"type">> => <<"user_list">>, <<"data">> => UsersList}).
