import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

import './Task.html';

Template.task.events({
    'click .toggle-checked'() {
        // Set the checked property to the opposite of its current value
        Meteor.call("tasks.setIsChecked", this._id, !this.isChecked)
      },
    
    'click .delete'() {
        Meteor.call("tasks.remove", this._id)
    }
})
