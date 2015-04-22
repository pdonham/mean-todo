(function(){
	'use strict';

	var controllerId = "todoCtrl";

	angular.module('app.controllers').controller(controllerId, ['todoService', todoCtrl]);

	function todoCtrl(todoService){
		var vm = this;

		vm.todos = [];

		var _init = function(){
			vm.refreshTodos();
		}

		vm.createTodo = function(todo){
			todoService.create(todo).then(
				function(success){
					vm.refreshTodos();
					vm.newTodo = {title: "", description: ""};
				},
				function(error){

				});
		}

		vm.refreshTodos = function(){
			todoService.get().then(
				function(success){
					vm.todos = success.data.todos;
					console.log(vm.todos);
				},
				function(error){

				});
		}

		_init();
	}

}());