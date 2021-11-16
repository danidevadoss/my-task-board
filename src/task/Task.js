import React from "react";

class Task extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      task: props.task
    };
    this.state.isExpand = false;
    this.state.isEdit = false;
  }

  render() {
    return (
      <div
        id={this.state.task.name}
        draggable= {!this.state.isEdit}
        onDragStart={e => !this.state.isEdit ?  this.drag(this.state.task): this.empty}
      >
        {!this.state.isExpand ? (
          <div
            className={"task " + this.props.status}
            onClick={ this.toggleExpand}
          >
            <a  style={{fontSize: 24, float: 'right'}} title={this.state.task.priority}>{this.getPriorityIconOnly(this.state.task.priority)}</a> 
            <p style={{fontSize: 14, marginBottom: 6}}>{this.state.task.createdOn}</p>
            <div>
              <p style={{ marginBottom: 4}}><b>{this.state.task.name}</b></p>
              {this.state.task.description.split ('\n').map ((item, i) => <p style={{fontSize: 13, marginBottom: 0}}key={i}>{item}</p>)}
            </div>
            
            {/* <button onClick={this.forward} >></button> */}
          </div>
        ) :  (
         
          <div
            className={"task " + this.props.status}
            onClick={!this.state.isEdit ? this.toggleExpand: this.empty}
          >
            <div style={{marginTop:4}}>
             
              {" "}
              <p className="delete-button" onClick={this.onDelete} id="delete">
                <i className="fa fa-trash-o" aria-hidden="true"></i>
              </p>
              
              {this.state.isEdit ? (<p className="edit-button" onClick={this.onSave} id="save">
                <i className="fa fa-floppy-o" aria-hidden="true"></i>
              </p>): <p className="edit-button" onClick={this.onEdit} id="edit">
                <i className= "fa fa-pencil" aria-hidden="true"></i>
              </p>}
               
            </div>
            <div style={{marginTop:6}}>
              <form autoComplete="off" onSubmit={this.onSave} >
              {" "}
              <p> 
                <b>Task:</b> {!this.state.isEdit  ? this.state.task.name : (<input type="text" value={this.state.task.name } onChange={(e) => this.setName(e)}  placeholder="Name" required className="form-control" id="task" />)}
              </p>
              <p>
                <b>Description:</b> { !this.state.isEdit  ?  this.state.task.description.split ('\n').map ((item, i) => <p style={{ marginBottom: 0}} key={i}>{item}</p>) : (<textarea type="text" value={this.state.task.description}  onChange={(e) => this.setDescription(e)}  placeholder="Description" required className="form-control" id="description" rows="2"> </textarea>)}
              </p>
              <p>
                <b>Priority:</b> {!this.state.isEdit  ? this.getPriorityIcon(this.state.task.priority) :(
                <div className="form-group text-center">
                                <label className="radio-inline margin-right">
                                    <input value={"Low"} checked={this.state.task.priority === "Low"} onChange={(e) => this.priorityChange("Low")} type="radio" name="low" />Low</label>
                                <label className="radio-inline margin-right">
                                    <input value={"Meduim"} checked={this.state.task.priority === "Meduim"} onChange={(e) => this.priorityChange("Meduim")} type="radio" name="medium" />Medium</label>
                                <label className="radio-inline margin-right">
                                    <input value={"High"} checked={this.state.task.priority === "High"} onChange={(e) => this.priorityChange("High")} type="radio" name="high" />High</label>
                            </div>)}
              </p>
              <p>
                <b>Created on:</b> {this.state.task.createdOn}
              </p>
                
                <button type="submit" style={{display: "none"}} className=" btn btn-primary create-button">Create</button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  
  stringInput(e) {
     e.stopPropagation();
        if (e && e.target && e.target.value) {
            if (e.target.value.length === 1) {
                return e.target.value.toUpperCase();
            } else {
                return e.target.value;
            }
        }
        return '';
    }
  
  empty=()=>{
    
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

 priorityChange = (value) => {
   let task = this.state.task;
   task.priority=value;
  this.setState({ task: task });
  }
 
onEdit=(e)=>{
 this.setState({ isEdit: !this.state.isEdit });
  e.stopPropagation();
}

setName=(e)=>{
  let task = this.state.task;
   if (e && e.target) {
     task.name= e.target.value;
     this.setState({ task: task });
   }
}

setDescription=(e)=>{
  let task = this.state.task;
   if (e && e.target) {
     task.description= e.target.value;
     this.setState({ task: task });
   }
}

onSave=(e)=>{  
  e.preventDefault();
  this.state.task.status = this.props.status;
  this.props.onTaskSave(this.state.task);
  this.setState({ isEdit: !this.state.isEdit });
}

  toggleExpand = () => {
    this.setState({ isExpand: !this.state.isExpand });
  };

  drag = task => {
    task.status = this.props.status;
    this.props.onDraggedTask(task);
  };

  getPriorityIcon(priority) {
    if (priority == "High") {
      return priority+" 🚀";
    } else if (priority == "Meduim") {
      return priority+" ☀️";
    } else {
      return priority+" ❄️";
    }
  }

 getPriorityIconOnly(priority) {
    if (priority == "High") {
      return "🚀 ";
    } else if (priority == "Meduim") {
      return "☀️ ";
    } else {
      return "❄️ ";
    }
  }
}
export default Task;
