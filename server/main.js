import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import { TasksCollection } from '/imports/db/TasksCollection';
import '/imports/api/taskMethods'
import '/imports/api/taskPublications'

const insertTodo = (taskTodo, user) => {
  return TasksCollection.insert({
    text: taskTodo,
    userId: user?._id,
    createdAt: new Date(),
  })
};

const SEED_USERNAME = "rijenmdr"
const SEED_PASSWORD = 'password'

Meteor.startup(() => {
  // code to run on server at startup

  if (!Accounts.findUserByUsername(SEED_USERNAME)) {
    Accounts.createUser({
      username: SEED_USERNAME,
      password: SEED_PASSWORD
    })
  }

  const user = Accounts.findUserByUsername(SEED_USERNAME);

  if (TasksCollection.find().count() === 0) {
    [
      'First Task',
      'Second Task',
      'Third Task',
      'Fourth Task',
      'Fifth Task',
      'Sixth Task',
      'Seventh Task'
    ].forEach(taskTodo => insertTodo(taskTodo, user))
  }
});
