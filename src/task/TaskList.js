
import React from 'react';
import Task from './Task'
import * as TaskStatus from './TaskStatus'
import HighchartsWrapper from './Chart'


class TaskList extends React.Component {
  
    taskList = {
        yetToStart: [{
            id: 0,
            name: "Create Your First Task",
            description: "Welcome.! Drag and drop to change status. Click to edit or delete.",
            priority: "High",
            createdOn: this.getDateInWords(),
            comments:[]
          

        }],
        inProgress: [],
        completed: []
    };

    getInitialState = () => {
        return {

        };
    }


    constructor(props) {
        super(props);
        this.state = {
            taskList: this.getTaskListFromLocalStorage(),
            selectedTask: null,
            series: [],
            name: '',
            description: '',
            priority: 'High'

        }
      this.state.showCongrats=false;
    }

    componentDidMount() {
        // console.log("mounted");
        this.populateChart();
      setInterval(() => this.callApp() , 270000);
    }

    render() {
        return (<div className="container-fluid" >
          
             <h2 style={{marginTop:10}} className="center" >👨🏻‍💻 My Task Board 👨🏻‍🏫</h2>
            <div className="row" >
                <div className="col-lg-3 task-list" onDrop={(e) => this.dropYetToStart(e)} onDragOver={(e) => this.onDragOver(e)} >
                    <h3 style={{marginTop:5}} className="center white">Yet To Start 🥚</h3>
                    {this.state.taskList.yetToStart.map((tsk) => (
                        <Task key={tsk.id} task={tsk} onTaskDelete={(e) => this.onTaskDelete(e)} onTaskSave={(e) => this.onTaskSave(e)}  status={"yetToStart"} onDraggedTask={this.onDraggedTask} />
                    ))}
                </div>
                <div className="col-lg-3 task-list" onDrop={(e) => this.dropInProgress(e)} onDragOver={(e) => this.onDragOver(e)}>
                    <h3 style={{marginTop:5}}  className="center white" >In Progress 🐣</h3>
                    {this.state.taskList.inProgress.map((tsk) => (
                        <Task key={tsk.id} task={tsk} onTaskDelete={(e) => this.onTaskDelete(e)} onTaskSave={(e) => this.onTaskSave(e)}  status={"inProgress"}  onDraggedTask={this.onDraggedTask} />
                    ))}
                </div>
                <div className="col-lg-3 task-list" onDrop={(e) => this.dropComplete(e)} onDragOver={(e) => this.onDragOver(e)}>
                    <h3 style={{marginTop:5}}  className="center white" >Completed 🐤</h3>
                    {this.state.taskList.completed.map((tsk) => (
                        <Task key={tsk.id} task={tsk} onTaskDelete={(e) => this.onTaskDelete(e)}  onTaskSave={(e) => this.onTaskSave(e)} status={"completed"}  onDraggedTask={this.onDraggedTask} />
                    ))}
                </div>
                <div className="col-lg-3">
                    <div>
                      {this.state.showCongrats?<img src="https://cdn.glitch.com/9616c901-913b-40a9-b7d5-8575eabb83bb%2Fbear.gif?v=1581654335342" className="congrats"/> : <></>}
                        <HighchartsWrapper chartData={this.state.series} />
                    </div>
                    <div>
                      
                        <h6 className="margin-top"><i className="fa fa-plus" aria-hidden="true"></i> Create New Task:</h6>
                        <form autoComplete="off" onSubmit={this.createTask} >
                            <div className="form-group">
                                <input type="text" value={this.state.name} onChange={(e) => this.setState({ name: this.stringInput(e) })} placeholder="Name" required className="form-control" id="task" />
                            </div>
                            <div className="form-group">
                                <textarea className="form-control" value={this.state.description} onChange={(e) => this.setState({ description: this.stringInput(e) })} placeholder="Description" rows="2" id="desc"></textarea>
                            </div>
                            <div className="form-group text-center">
                                <label className="radio-inline margin-right">
                                    <input value={"Low"} checked={this.state.priority === "Low"} onChange={(e) => this.priorityChange("Low")} type="radio" name="low" />Low</label>
                                <label className="radio-inline margin-right">
                                    <input value={"Meduim"} checked={this.state.priority === "Meduim"} onChange={(e) => this.priorityChange("Meduim")} type="radio" name="medium" />Medium</label>
                                <label className="radio-inline margin-right">
                                    <input value={"High"} checked={this.state.priority === "High"} onChange={(e) => this.priorityChange("High")} type="radio" name="high" />High</label>
                            </div>

                            <div className="text-center">
                                <button type="submit" className=" btn btn-primary create-button">Create</button>
                            </div>
                        </form>

                    </div>
                </div>

            </div>
            
        </div>);
    }

    priorityChange = (value) => {
        this.setState({ priority: value })
    }

    stringInput(e) {
        if (e && e.target && e.target) {
            if (e.target.value && e.target.value.length === 1) {
                return e.target.value.toUpperCase();
            } else {
                return e.target.value;
            }
        }
        return '';
    }

    createTask = (e) => {
        console.log("createTask", e);
        e.preventDefault();
        let newTask = {
            id: Math.floor((Math.random() * 100000) + 1),
            name: this.state.name,
            description: this.state.description,
            priority: this.state.priority,
            createdOn: this.getDateInWords()
        }
      
        let taskList = this.state.taskList;
        taskList.yetToStart.push(newTask);
        this.setState({
            task: taskList,
            name: '',
            description: ''

        });
        this.populateChart();
        this.saveToLocalStorage();
    }
    
    getDateInWords(){
      let d = new Date(),
      minutes = d.getMinutes().toString().length == 1 ? '0'+d.getMinutes() : d.getMinutes(),
      hours = d.getHours().toString().length == 1 ? '0'+d.getHours() : d.getHours(),
      ampm = d.getHours() >= 12 ? 'pm' : 'am',
      months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
      return days[d.getDay()]+' '+months[d.getMonth()]+' '+d.getDate()+' '+d.getFullYear()+' '+hours+':'+minutes+ampm;
    }

    saveToLocalStorage() {
        localStorage.setItem('taskList', JSON.stringify(this.state.taskList));
    }
    getTaskListFromLocalStorage = () => {
        let taskList = localStorage.getItem('taskList');
        if (taskList) {
            return JSON.parse(taskList)
        }
        return this.taskList;
    }

    onDragOver = (e) => {
        //console.log('onDragOver', e);
        e.stopPropagation();
        e.preventDefault();
    }

    onDraggedTask = (e) => {
        //console.log('onDraggedTask', e.name);
        this.setState({ selectedTask: e })
    }

    onTaskDelete = (task) => {
        let taskList = this.state.taskList;
        let index = taskList[task.status].findIndex((x) => x.id === task.id);
        if (index !== -1) {
            // console.log('index', index);
            taskList[task.status].splice(index, 1);
            this.setState({ taskList: taskList });
        }
        this.saveToLocalStorage();
        this.populateChart();
    }
    
    onTaskSave = (task)=>{
      let taskList = this.state.taskList;
      let index = taskList[task.status].findIndex((x) => x.id === task.id);
      if (index !== -1) {
        taskList[task.status][index]=task;
         this.setState({ taskList: taskList });
        this.saveToLocalStorage();
      }
      
    }

    dropYetToStart = (e) => {
        // console.log('dropYetToStart', this.state.selectedTask.name);
        this.moveTask(TaskStatus.YET_TO_START);
        this.saveToLocalStorage();
    }

    dropInProgress = (e) => {
        //  console.log('dropInProgress', this.state.selectedTask.name);
        this.moveTask(TaskStatus.IN_PROGRESS);
        this.saveToLocalStorage();
    }

    dropComplete = (e) => {
        //  console.log('dropComplete', this.state.selectedTask.name);
        this.moveTask(TaskStatus.COMPLETE);
        this.saveToLocalStorage();
    }

    moveTask = (statusToMove) => {
      
        if (this.state.selectedTask != null) {
            let task = this.state.selectedTask;
            let taskList = this.state.taskList;
            let index = taskList[task.status].findIndex((x) => x.id === task.id);
            if (index !== -1) {
                console.log('index', index);
                taskList[task.status].splice(index, 1);
                task.status = statusToMove;
                taskList[statusToMove].push(task);
                this.setState({ taskList: taskList });
                this.setState({ selectedTask: null })
            }
        }
        this.populateChart();
      
      if(statusToMove=='completed'){
        this.showCongrats();
      }
    }

    populateChart = () => {

        let data = [{
            name: 'Yet to start',
            y: this.state.taskList.yetToStart.length
        }, {
            name: 'In Progress',
            y: this.state.taskList.inProgress.length
        }, {
            name: 'Completed',
            y: this.state.taskList.completed.length
        }]
        //this.state.series = data;
        this.setState({ series: data })
    }

    getTodayDate() {
        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth() + 1; //January is 0!

        let yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        return dd + '/' + mm + '/' + yyyy;
    }


callApp(){
  //console.log('reloading page');
  //window.location.reload();
}

showCongrats=()=>{
   this.setState({ showCongrats: true });
  setTimeout(() => {
  this.setState({ showCongrats: false });
}, 5000);
}

}
export default TaskList;
