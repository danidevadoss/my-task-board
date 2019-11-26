
import React from 'react';
import Task from './Task'
import * as TaskStatus from './TaskStatus'
import HighchartsWrapper from './Chart'

class TaskList extends React.Component {
  
    taskList = {
        yetToStart: [{
            id: 0,
            name: "Create Your Task",
            description: "Welcome.! Please create your task",
            priority: "High",
            createdOn: "01/10/2019"

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
    }

    componentDidMount() {
        // console.log("mounted");
        this.populateChart();
    }

    render() {
        return (<div className="container-fluid task-width" >
             <h2 className="center" >My Task Board</h2>
            <div className="row" >
                <div className="col-lg-3 task-list" onDrop={(e) => this.dropYetToStart(e)} onDragOver={(e) => this.onDragOver(e)} >
                    <h3 className="center white">Yet To Start</h3>
                    {this.state.taskList.yetToStart.map((tsk) => (
                        <Task key={tsk.id} task={tsk} onTaskDelete={(e) => this.onTaskDelete(e)} status={"yetToStart"} onDraggedTask={this.onDraggedTask} />
                    ))}
                </div>
                <div className="col-lg-3 task-list" onDrop={(e) => this.dropInProgress(e)} onDragOver={(e) => this.onDragOver(e)}>
                    <h3 className="center white" >In Progress</h3>
                    {this.state.taskList.inProgress.map((tsk) => (
                        <Task key={tsk.id} task={tsk} onTaskDelete={(e) => this.onTaskDelete(e)} status={"inProgress"}  onDraggedTask={this.onDraggedTask} />
                    ))}
                </div>
                <div className="col-lg-3 task-list" onDrop={(e) => this.dropComplete(e)} onDragOver={(e) => this.onDragOver(e)}>
                    <h3 className="center white" >Completed</h3>
                    {this.state.taskList.completed.map((tsk) => (
                        <Task key={tsk.id} task={tsk} onTaskDelete={(e) => this.onTaskDelete(e)} status={"completed"}  onDraggedTask={this.onDraggedTask} />
                    ))}
                </div>
                <div className="col-lg-3">
                    <div>
                        <HighchartsWrapper chartData={this.state.series} />
                    </div>
                    <div>
                        <h6 className="margin-top">Create New Task:</h6>
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
        if (e && e.target && e.target.value) {
            if (e.target.value.length === 1) {
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
            createdOn: this.getTodayDate()
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

}
export default TaskList;