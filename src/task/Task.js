import React from "react";

class Task extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      task: props.task
    };
    this.state.isExpand = false;
  }

  render() {
    return (
      <div
        id={this.state.task.name}
        draggable="true"
        onDragStart={e => this.drag(this.state.task)}
      >
        {!this.state.isExpand ? (
          <div
            className={"task " + this.props.status}
            onClick={this.toggleExpand}
          >
            <b>{this.state.task.name}</b>
            <p title={this.state.task.priority}> Priority: {this.getPriorityIcon(this.state.task.priority)}</p>
            {/* <button onClick={this.forward} >></button> */}
          </div>
        ) : (
          <div
            className={"task " + this.props.status}
            onClick={this.toggleExpand}
          >
            <div>
              {" "}
              <p className="delete-button" onClick={this.onDelete}>
                <i className="fa fa-trash-o" aria-hidden="true"></i>
              </p>
            </div>
            <div>
              {" "}
              <p>
                <b>Task:</b> {this.state.task.name}
              </p>
              <p>
                <b>Description:</b> {this.state.task.description}
              </p>
              <p>
                <b>Priority:</b> {this.getPriorityIcon(this.state.task.priority)}
              </p>
              <p>
                <b>Created on:</b> {this.state.task.createdOn}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  onDelete = () => {
    // alert("delete");
    // console.log(this.props.taskList);
    // const index = this.props.taskList.findIndex(x => x.id === this.state.task.id);
    // if(index!==-1){
    //     this.props.taskList.splice(index,1);
    // }
    this.state.task.status = this.props.status;
    this.props.onTaskDelete(this.state.task);
  };

  toggleExpand = () => {
    this.setState({ isExpand: !this.state.isExpand });
  };

  drag = task => {
    task.status = this.props.status;
    this.props.onDraggedTask(task);
  };

  getPriorityIcon(priority) {
    if (priority == "High") {
      return priority+" 🔥";
    } else if (priority == "Meduim") {
      return priority+" 🌕";
    } else {
      return priority+" ❄️";
    }
  }
}
export default Task;
