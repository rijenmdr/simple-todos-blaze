import { Template } from 'meteor/templating'
import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';
import { TasksCollection } from '../db/TasksCollection.js'

import './App.html'
import './Task.js'
import './Login.js'

const HIDE_COMPLETED_STRING = "hideCompleted";
const SHOW_LOADING = "showLoading";

const getUser = () => Meteor.user();
const isUserLogged = () => !!getUser();

Template.mainContainer.onCreated(function mainContainerOnCreated() {
    this.state = new ReactiveDict();
    this.state.set(HIDE_COMPLETED_STRING, true);

    const handler = Meteor.subscribe("tasks");
    Tracker.autorun(() => {
        this.state.set(SHOW_LOADING, !handler.ready())
    })
})

Template.mainContainer.helpers({
    isUserLoggedIn() {
        return isUserLogged();
    },
    tasks() {
        const user = getUser();

        if (!isUserLogged()) {
            return []
        }

        const inst = Template.instance();
        const hideCompleted = inst.state.get(HIDE_COMPLETED_STRING);
        let filterQuery = { userId: user?._id }

        if (hideCompleted) filterQuery = { ...filterQuery, isChecked: { $ne: true } };

        return TasksCollection.find(filterQuery, { sort: { createdAt: -1 } })
    },
    showUnCompletedCount() {
        if (!isUserLogged()) {
            return '';
        }
        return TasksCollection.find({ isChecked: { $ne: true } }).count();
    },
    hideCompleted() {
        const inst = Template.instance();
        return inst.state.get(HIDE_COMPLETED_STRING)
    },
    showLoading() {
        const inst = Template.instance();
        return inst.state.get(SHOW_LOADING)
    }
});

Template.mainContainer.events({
    "click #hide-completed-button"(event, instance) {
        const currentHideComplete = instance.state.get(HIDE_COMPLETED_STRING);
        instance.state.set(HIDE_COMPLETED_STRING, !currentHideComplete)
    },
    "click .logout"() {
        Meteor.logout();
    }
})

Template.form.events({
    "submit .task-form"(event) {
        // Prevent default browser form submit
        event.preventDefault();

        const target = event.target;
        const text = target.text.value;

        if (!text) return;

        Meteor.call("tasks.insert", text);

        target.text.value = "";
    },
})