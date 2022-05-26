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
  %% online_users:start_server(),
  io:fwrite("Server starts \n"),
  Server = spawn(fun()-> main_loop([]) end),
  register(sinkandwin_server, Server),
  io:fwrite("Server registered \n").

main_loop(OnlineUsersList) ->
  io:fwrite("Main loop started \n"),
  receive
    {addUser, Username} ->
      io:format("addUser : ~p\n", [Username]),
        notify_all({addUser, Username}, OnlineUsersList),
        NewListUsers = OnlineUsersList ++ [Username],
        io:format("Online users : ~p\n", [NewListUsers]),
        main_loop(NewListUsers);
    {getUser, Username} ->
        io:format("getUser : ~p\n", [Username]),
        notify_one(Username, OnlineUsersList),
        io:format("Online users : ~p\n", [OnlineUsersList]),
        main_loop(OnlineUsersList);
    {delUser, Username} ->
        notify_all({delUser, Username}, OnlineUsersList),
        NewListUsers = lists:delete(Username, OnlineUsersList),
        io:format("User ~n deleted\n ", Username),
        main_loop(NewListUsers);
    _ -> ok
  end,
  main_loop(OnlineUsersList).


notify_all(_, []) ->
  ok;

notify_all({addUser,CurrentUser}, [First | Others]) ->
    whereis(First) ! jsx:encode(#{<<"type">> => <<"add_user">>,<<"data">> => CurrentUser}),
    notify_all({addUser, CurrentUser}, Others);

notify_all({delUser,CurrentUser}, [First | Others]) ->
    whereis(First) ! jsx:encode(#{<<"type">> => <<"delete_user">>,<<"data">> => CurrentUser}),
    notify_all({delUser, CurrentUser}, Others).

notify_one(Username, UsersList) ->
    io:fwrite("First: ~p~n", [Username]),
    whereis(Username) ! jsx:encode(#{<<"type">> => <<"user_list">>, <<"data">> => UsersList}).

