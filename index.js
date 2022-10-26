"use strict";

// FCFS
const isAlpha = function (ch) {
    return /^[A-Z]$/i.test(ch);
}
const checkInput = function (arr) {
    for (let ch of arr) {
        if (isAlpha(ch)) {
            return true
        }
    }
    return false
}
const getFinishTime = function (arival_time, burst_time) {
    const arr = []
    arr.push(arival_time[0] + burst_time[0])
    for (let i = 1; i < burst_time.length; i++) {
        arr.push(arr[i - 1] + burst_time[i])
    }
    return arr
}
const getWaitingTime = function (turnaround_time, burst_time) {
    const arr = []
    for (let i = 0; i < burst_time.length; i++) {
        arr.push(turnaround_time[i] - burst_time[i] > 0 ? turnaround_time[i] - burst_time[i] : 0)
    }
    return arr
}
const getTurnAroundTime = function (finish_time, arival_time) {
    const arr = []
    for (let i = 0; i < finish_time.length; i++) {
        arr.push(finish_time[i] - arival_time[i] > 0 ? finish_time[i] - arival_time[i] : 0)
    }
    return arr
}
const average = function (arr) {
    return (arr.reduce((prev, cur) => prev + cur) / arr.length)
}
const correctedValue = function (times_arival, times_burst) {
    const arr = []
    for (let i = 0; i < times_arival.length; i++) {
        arr.push([times_arival[i], times_burst[i]])
    }
    arr.sort((a, b) => a[0] - b[0])
    for (let i = 0; i < times_arival.length; i++) {
        times_arival[i] = arr[i][0]
        times_burst[i] = arr[i][1]
    }
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

const FCFS = function () {
    const arivalTimeInput = document.querySelector('.fcfs-arival')
    const burstTimeInput = document.querySelector('.fcfs-burst')
    const run = document.querySelector('.fcfs-btn')
    const table_chart_area = document.querySelector('.table-chart')
    const output_area = document.querySelector(".output-area")
    let times_arival = []
    let times_burst = []
    let finish_time = []
    let turnaround_time = []
    let waiting_time = []

    let already_clicked = false

    run.addEventListener('click', () => {
        times_arival = arivalTimeInput.value.trim().split(" ").filter((str) => (
            str !== ""
        ))
        times_burst = burstTimeInput.value.trim().split(" ").filter((str) => (
            str !== ""
        ))
        if (checkInput(times_arival) || checkInput(times_burst) || times_arival.length !== times_burst.length || times_arival.length === 0 || times_burst.length === 0) {
            alert("Invalid Input")
            arivalTimeInput.value = ""
            burstTimeInput.value = ""
            return
        }
        times_arival = times_arival.map((item) => Number.parseInt(item))
        times_burst = times_burst.map((item) => Number.parseInt(item))
        correctedValue(times_arival, times_burst)
        finish_time = getFinishTime(times_arival, times_burst)
        turnaround_time = getTurnAroundTime(finish_time, times_arival)
        waiting_time = getWaitingTime(turnaround_time, times_burst)
        const len = times_arival.length
        console.log(finish_time);

        if (already_clicked) {
            alert("You have simulated this once, if you want to use this simulation again you have to reload the page.")
            if (confirm("Do you want to reload ?")) {
                location.reload()
            }
            return
        }
        already_clicked = true;

        let tbody = document.querySelector('.tbody')
        for (let i = 0; i < len; i++) {
            const tr = document.createElement('tr')
            tr.classList.add("cell")
            tbody.appendChild(tr)
        }
        const cell = document.querySelectorAll('.cell')
        arivalTimeInput.value = ""
        burstTimeInput.value = ""
        output_area.classList.remove("hide")
        for (let id = 0; id < cell.length; id++) {
            console.log(cell[id]);
            for (let j = 0; j < 6; j++) {
                const td = document.createElement("td")
                if (j === 0)
                    td.innerHTML = String.fromCharCode(65 + id)
                if (j === 1) {
                    setTimeout(() => {
                        td.innerHTML = String(times_arival[id])
                    }, 100)
                }
                if (j === 2) {
                    setTimeout(() => {
                        td.innerHTML = String(times_burst[id])
                    }, 100)
                }
                if (j === 3) {
                    setTimeout(() => {
                        td.innerHTML = String(finish_time[id])
                    }, 300)
                }
                if (j == 4) {
                    setTimeout(() => {
                        td.innerHTML = String(turnaround_time[id])
                    }, 300)
                }
                if (j == 5) {
                    setTimeout(() => {
                        td.innerHTML = String(waiting_time[id])
                    }, len * 403)
                }
                cell[id].appendChild(td)
            }
        }


        const avg_trunaround = average(turnaround_time)
        const avg_waiting = average(waiting_time)
        const p = document.createElement('p')
        p.classList.add("average")
        p.innerHTML = `The average of turnaround time is <em> ${avg_trunaround} </em> and average of waiting time is <em> ${avg_waiting} </em>`
        table_chart_area.appendChild(p)

        // Gantt Chart Logic
        const chart_row = document.querySelector('.chart-row')
        for (let i = 0; i < len; i++) {
            const td = document.createElement('td')
            td.innerHTML = String.fromCharCode(65 + i)
            td.style.width = String(times_burst[i] * 50) + "px";
            td.style.backgroundColor = getRandomColor()
            setTimeout(() => {
                chart_row.appendChild(td)
            }, i * 400)
        }
    })
    const modal = document.getElementById("modal-content-fcfs")
    const modalBtn = document.querySelector(".myBtn-fcfs")
    console.log(modal);
    modalBtn.addEventListener("click", () => {
        const hasDel = document.querySelector(".del") !== null
        if (hasDel) return;
        const p1 = document.createElement("p")
        p1.classList.add("del")
        const p2 = document.createElement("p")
        p2.classList.add("del")
        const hr = document.createElement("hr")
        hr.classList.add("del")
        p1.innerHTML = `Average <em>turnaround time </em> = (Exit time - Arrival time)`
        p2.innerHTML = `For example ${finish_time[0]} - ${times_arival[0]} = ${finish_time[0] - times_arival[0]}`
        modal.appendChild(p1)
        modal.appendChild(p2)
        modal.appendChild(hr)
        const p3 = document.createElement("p")
        p3.classList.add("del")
        const p4 = document.createElement("p")
        p4.classList.add("del")
        p3.innerHTML = `Average <em>waiting time </em> = (Turnaround time - Burst time)`
        p4.innerHTML = `For example ${turnaround_time[0]} - ${times_burst[0]} = ${turnaround_time[0] - times_burst[0]}`
        modal.appendChild(p3)
        modal.appendChild(p4)
    })
}


const PriorityScheduling_nonPreemptive = function () {
    const arivalTimeInput = document.querySelector('.npp-arrival')
    const burstTimeInput = document.querySelector('.npp-burst')
    const priorityInput = document.querySelector('.npp-priority')
    const run = document.getElementById('npp-btn')
    const output_area = document.querySelector(".output-area-nppm")

    let times_arival = []
    let times_priority = []
    let times_burst = []
    let already_clicked = false
    let finish_time = []
    let turnaround_time = []
    let waiting_time = []

    run.addEventListener('click', () => {
        times_arival = arivalTimeInput.value.trim().split(" ").filter((str) => (
            str !== ""
        ))
        times_burst = burstTimeInput.value.trim().split(" ").filter((str) => (
            str !== ""
        ))
        times_priority = priorityInput.value.trim().split(" ").filter((str) => (
            str !== ""
        ))
        times_arival = times_arival.map((item) => Number.parseInt(item))
        times_burst = times_burst.map((item) => Number.parseInt(item))
        times_priority = times_priority.map((item) => Number.parseInt(item))
        if (checkInput(times_arival) || checkInput(times_burst) || times_arival.length !== times_burst.length || times_arival.length === 0 || times_burst.length === 0) {
            alert("Invalid Input")
            arivalTimeInput.value = ""
            burstTimeInput.value = ""
            return
        }
        if (already_clicked) {
            alert("You have simulated this once, if you want to use this simulation again you have to reload the page.")
            if (confirm("Do you want to reload ?")) {
                location.reload()
            }
            return
        }
        already_clicked = true;
        const timeInfo = times_arival
            .map((item, index) => {
                return {
                    job: (index + 10).toString(36).toUpperCase(),
                    at: item,
                    bt: times_burst[index],
                    priority: times_priority[index],
                };
            })
            .sort((process1, process2) => {
                if (process1.at > process2.at) return 1;
                if (process1.at < process2.at) return -1;
                if (process1.priority > process2.priority) return 1;
                if (process1.priority < process2.priority) return -1;
                return 0;
            });
        let finishTime = [];
        let ganttChartInfo = [];

        const solvedtimeInfo = [];
        const readyQueue = [];
        const finishedJobs = [];

        for (let i = 0; i < timeInfo.length; i++) {
            if (i === 0) {
                readyQueue.push(timeInfo[0]);
                finishTime.push(timeInfo[0].at + timeInfo[0].bt);
                solvedtimeInfo.push({
                    ...timeInfo[0],
                    ft: finishTime[0],
                    tat: finishTime[0] - timeInfo[0].at,
                    wat: finishTime[0] - timeInfo[0].at - timeInfo[0].bt,
                });

                timeInfo.forEach((p) => {
                    if (p.at <= finishTime[0] && !readyQueue.includes(p)) {
                        readyQueue.push(p);
                    }
                });

                readyQueue.shift();
                finishedJobs.push(timeInfo[0]);

                ganttChartInfo.push({
                    job: timeInfo[0].job,
                    start: timeInfo[0].at,
                    stop: finishTime[0],
                });
            } else {
                if (
                    readyQueue.length === 0 &&
                    finishedJobs.length !== timeInfo.length
                ) {
                    const unfinishedJobs = timeInfo
                        .filter((p) => {
                            return !finishedJobs.includes(p);
                        })
                        .sort((a, b) => {
                            if (a.at > b.at) return 1;
                            if (a.at < b.at) return -1;
                            if (a.priority > b.priority) return 1;
                            if (a.priority < a.priority) return -1;
                            return 0;
                        });
                    readyQueue.push(unfinishedJobs[0]);
                }

                // Equal-priority processes are scheduled in FCFS order.
                const rqSortedByPriority = [...readyQueue].sort((a, b) => {
                    if (a.priority > b.priority) return 1;
                    if (a.priority < b.priority) return -1;
                    if (a.at > b.at) return 1;
                    if (a.at < b.at) return -1;
                    return 0;
                });

                const executingProcess = rqSortedByPriority[0];

                const previousFinishTime = finishTime[finishTime.length - 1];

                if (executingProcess.at > previousFinishTime) {
                    finishTime.push(executingProcess.at + executingProcess.bt);
                    const newestFinishTime = finishTime[finishTime.length - 1];
                    ganttChartInfo.push({
                        job: executingProcess.job,
                        start: executingProcess.at,
                        stop: newestFinishTime,
                    });
                } else {
                    finishTime.push(previousFinishTime + executingProcess.bt);
                    const newestFinishTime = finishTime[finishTime.length - 1];
                    ganttChartInfo.push({
                        job: executingProcess.job,
                        start: previousFinishTime,
                        stop: newestFinishTime,
                    });
                }

                const newestFinishTime = finishTime[finishTime.length - 1];

                solvedtimeInfo.push({
                    ...executingProcess,
                    ft: newestFinishTime,
                    tat: newestFinishTime - executingProcess.at,
                    wat: newestFinishTime - executingProcess.at - executingProcess.bt,
                });

                timeInfo.forEach((p) => {
                    if (
                        p.at <= newestFinishTime &&
                        !readyQueue.includes(p) &&
                        !finishedJobs.includes(p)
                    ) {
                        readyQueue.push(p);
                    }
                });

                const indexToRemove = readyQueue.indexOf(executingProcess);
                if (indexToRemove > -1) {
                    readyQueue.splice(indexToRemove, 1);
                }

                finishedJobs.push(executingProcess);
            }
        }

        // Sort the processes by job name within arrival time
        solvedtimeInfo.sort((obj1, obj2) => {
            if (obj1.at > obj2.at) return 1;
            if (obj1.at < obj2.at) return -1;
            if (obj1.job > obj2.job) return 1;
            if (obj1.job < obj2.job) return -1;
            return 0;
        });

        times_arival = []
        times_burst = []
        times_arival = solvedtimeInfo.map(item => (
            item.at
        ))

        times_burst = solvedtimeInfo.map(item => (
            item.bt
        ))
        finish_time = solvedtimeInfo.map(item => (
            item.ft
        ))
        turnaround_time = solvedtimeInfo.map(item => (
            item.tat
        ))
        waiting_time = solvedtimeInfo.map(item => (
            item.wat
        ))
        const len = solvedtimeInfo.length
        let tbody = document.querySelector('.tbody-nppm')
        for (let i = 0; i < len; i++) {
            const tr = document.createElement('tr')
            tr.classList.add("cell-nppm")
            tbody.appendChild(tr)
        }
        const cell = document.querySelectorAll('.cell-nppm')
        arivalTimeInput.value = ""
        burstTimeInput.value = ""
        priorityInput.value = ""
        output_area.classList.remove("hide-nppm")
        for (let id = 0; id < cell.length; id++) {
            console.log(cell[id]);
            for (let j = 0; j < 6; j++) {
                const td = document.createElement("td")
                if (j === 0)
                    td.innerHTML = String.fromCharCode(65 + id)
                if (j === 1) {
                    setTimeout(() => {
                        td.innerHTML = String(times_arival[id])
                    }, 100)
                }
                if (j === 2) {
                    setTimeout(() => {
                        td.innerHTML = String(times_burst[id])
                    }, 100)
                }
                if (j === 3) {
                    setTimeout(() => {
                        td.innerHTML = String(finish_time[id])
                    }, 300)
                }
                if (j == 4) {
                    setTimeout(() => {
                        td.innerHTML = String(turnaround_time[id])
                    }, 300)
                }
                if (j == 5) {
                    setTimeout(() => {
                        td.innerHTML = String(waiting_time[id])
                    }, len * 403)
                }
                cell[id].appendChild(td)
            }
        }
        const table_chart_area = document.querySelector('.table-chart-nppm')
        const avg_trunaround = average(turnaround_time)
        const avg_waiting = average(waiting_time)
        const p = document.createElement('p')
        p.classList.add("average")
        p.innerHTML = `The average of turnaround time is <em> ${avg_trunaround} </em> and average of waiting time is <em> ${avg_waiting} </em>`
        table_chart_area.appendChild(p)
        // Grant Chart Logic
        const chart_row = document.querySelector('.chart-row-nppm')
        for (let i = 0; i < len; i++) {
            const td = document.createElement('td')
            td.innerHTML = String.fromCharCode(65 + i)
            td.style.width = String(times_burst[i] * 50) + "px";
            td.style.backgroundColor = getRandomColor()
            setTimeout(() => {
                chart_row.appendChild(td)
            }, i * 400)
        }
    })
    const modal = document.getElementById("modal-content-nppm")
    const modalBtn = document.querySelector(".myBtn-nppm")
    console.log(modal);
    modalBtn.addEventListener("click", () => {
        const hasDel = document.querySelector(".del") !== null
        if (hasDel) return;
        const p1 = document.createElement("p")
        p1.classList.add("del")
        const p2 = document.createElement("p")
        p2.classList.add("del")
        const hr = document.createElement("hr")
        hr.classList.add("del")
        p1.innerHTML = `Average <em>turnaround time </em> = (Exit time - Arrival time)`
        p2.innerHTML = `For example ${finish_time[0]} - ${times_arival[0]} = ${finish_time[0] - times_arival[0]}`
        modal.appendChild(p1)
        modal.appendChild(p2)
        modal.appendChild(hr)
        const p3 = document.createElement("p")
        p3.classList.add("del")
        const p4 = document.createElement("p")
        p4.classList.add("del")
        p3.innerHTML = `Average <em>waiting time </em> = (Turnaround time - Burst time)`
        p4.innerHTML = `For example ${turnaround_time[0]} - ${times_burst[0]} = ${turnaround_time[0] - times_burst[0]}`
        modal.appendChild(p3)
        modal.appendChild(p4)
    })
}


const PriorityScheduling_Preemptive = function () {
    const arivalTimeInput = document.querySelector('.pp-arrival')
    const burstTimeInput = document.querySelector('.pp-burst')
    const priorityInput = document.querySelector('.pp-priority')
    const run = document.getElementById('pp-btn')
    const output_area = document.querySelector(".output-area-ppm")

    let times_arival = []
    let times_priority = []
    let times_burst = []
    run.addEventListener('click', () => {
        times_arival = arivalTimeInput.value.trim().split(" ").filter((str) => (
            str !== ""
        ))
        times_burst = burstTimeInput.value.trim().split(" ").filter((str) => (
            str !== ""
        ))
        times_priority = priorityInput.value.trim().split(" ").filter((str) => (
            str !== ""
        ))
        times_arival = times_arival.map((item) => Number.parseInt(item))
        times_burst = times_burst.map((item) => Number.parseInt(item))
        times_priority = times_priority.map((item) => Number.parseInt(item))

        let already_clicked = false

        if (checkInput(times_arival) || checkInput(times_burst) || times_arival.length !== times_burst.length || times_arival.length === 0 || times_burst.length === 0) {
            alert("Invalid Input")
            arivalTimeInput.value = ""
            burstTimeInput.value = ""
            return
        }
        if (already_clicked) {
            alert("You have simulated this once, if you want to use this simulation again you have to reload the page.")
            if (confirm("Do you want to reload ?")) {
                location.reload()
            }
            return
        }
        already_clicked = true;
        const processesInfo = times_arival
            .map((item, index) => {
                return {
                    job: (index + 10).toString(36).toUpperCase(),
                    at: item,
                    bt: times_burst[index],
                    priority: times_priority[index],
                };
            })
            .sort((process1, process2) => {
                if (process1.at > process2.at) return 1;
                if (process1.at < process2.at) return -1;
                if (process1.priority > process2.priority) return 1;
                if (process1.priority < process2.priority) return -1;
                return 0;
            });

        const solvedtimeInfo = [];
        const ganttChartInfo = [];

        const readyQueue = [];
        let currentTime = processesInfo[0].at;
        const unfinishedJobs = [...processesInfo];

        const remainingTime = processesInfo.reduce((acc, process) => {
            acc[process.job] = process.bt;
            return acc;
        }, {});

        readyQueue.push(unfinishedJobs[0]);
        while (
            Object.values(remainingTime).reduce((acc, cur) => {
                return acc + cur;
            }, 0) &&
            unfinishedJobs.length > 0
        ) {
            let prevIdle = false;
            if (readyQueue.length === 0 && unfinishedJobs.length > 0) {
                prevIdle = true;
                readyQueue.push(unfinishedJobs[0]);
            }

            readyQueue.sort((a, b) => {
                // Equal-priority processes are scheduled in FCFS order.
                if (a.priority > b.priority) return 1;
                if (a.priority < b.priority) return -1;
                return 0;
            });

            const processToExecute = readyQueue[0];

            const processATLessThanBT = processesInfo.filter((p) => {
                let curr = currentTime;
                if (prevIdle) {
                    curr = processToExecute.at;
                }

                return (
                    p.at <= remainingTime[processToExecute.job] + curr &&
                    p !== processToExecute &&
                    !readyQueue.includes(p) &&
                    unfinishedJobs.includes(p)
                );
            });
            let gotInterruption = false;
            processATLessThanBT.some((p) => {
                if (prevIdle) {
                    currentTime = processToExecute.at;
                }

                const amount = p.at - currentTime;

                if (currentTime >= p.at) {
                    readyQueue.push(p);
                }

                if (p.priority < processToExecute.priority) {
                    remainingTime[processToExecute.job] -= amount;
                    readyQueue.push(p);
                    const prevCurrentTime = currentTime;
                    currentTime += amount;
                    ganttChartInfo.push({
                        job: processToExecute.job,
                        start: prevCurrentTime,
                        stop: currentTime,
                    });
                    gotInterruption = true;
                    return true;
                }
            });
            const processToArrive = processesInfo.filter((p) => {
                return (
                    p.at <= currentTime &&
                    p !== processToExecute &&
                    !readyQueue.includes(p) &&
                    unfinishedJobs.includes(p)
                );
            });

            // Push new processes to readyQueue
            readyQueue.push(...processToArrive);

            if (!gotInterruption) {
                if (prevIdle) {
                    const remainingT = remainingTime[processToExecute.job];
                    remainingTime[processToExecute.job] -= remainingT;
                    currentTime = processToExecute.at + remainingT;

                    processATLessThanBT.forEach((p) => {
                        if (currentTime >= p.at) {
                            readyQueue.push(p);
                        }
                    });

                    ganttChartInfo.push({
                        job: processToExecute.job,
                        start: processToExecute.at,
                        stop: currentTime,
                    });
                } else {
                    const remainingT = remainingTime[processToExecute.job];
                    remainingTime[processToExecute.job] -= remainingT;
                    const prevCurrentTime = currentTime;
                    currentTime += remainingT;

                    processATLessThanBT.forEach((p) => {
                        if (currentTime >= p.at && !readyQueue.includes(p)) {
                            readyQueue.push(p);
                        }
                    });

                    ganttChartInfo.push({
                        job: processToExecute.job,
                        start: prevCurrentTime,
                        stop: currentTime,
                    });
                }
            }

            // Requeueing (move head/first item to tail/last)
            readyQueue.push(readyQueue.shift());

            // When the process finished executing
            if (remainingTime[processToExecute.job] === 0) {
                const indexToRemoveUJ = unfinishedJobs.indexOf(processToExecute);
                if (indexToRemoveUJ > -1) {
                    unfinishedJobs.splice(indexToRemoveUJ, 1);
                }
                const indexToRemoveRQ = readyQueue.indexOf(processToExecute);
                if (indexToRemoveRQ > -1) {
                    readyQueue.splice(indexToRemoveRQ, 1);
                }

                solvedtimeInfo.push({
                    ...processToExecute,
                    ft: currentTime,
                    tat: currentTime - processToExecute.at,
                    wat: currentTime - processToExecute.at - processToExecute.bt,
                });
            }
        }

        // Sort the processes by job name within arrival time
        solvedtimeInfo.sort((process1, process2) => {
            if (process1.at > process2.at) return 1;
            if (process1.at < process2.at) return -1;
            if (process1.job > process2.job) return 1;
            if (process1.job < process2.job) return -1;
            return 0;
        });

        console.log({ solvedtimeInfo, ganttChartInfo });

        times_arival = []
        times_burst = []
        let finish_time = []
        let turnaround_time = []
        let waiting_time = []
        times_arival = solvedtimeInfo.map(item => (
            item.at
        ))

        times_burst = solvedtimeInfo.map(item => (
            item.bt
        ))
        finish_time = solvedtimeInfo.map(item => (
            item.ft
        ))
        turnaround_time = solvedtimeInfo.map(item => (
            item.tat
        ))
        waiting_time = solvedtimeInfo.map(item => (
            item.wat
        ))
        const len = solvedtimeInfo.length
        let tbody = document.querySelector('.tbody-ppm')
        for (let i = 0; i < len; i++) {
            const tr = document.createElement('tr')
            tr.classList.add("cell-ppm")
            tbody.appendChild(tr)
        }
        const cell = document.querySelectorAll('.cell-ppm')
        arivalTimeInput.value = ""
        burstTimeInput.value = ""
        priorityInput.value = ""
        output_area.classList.remove("hide-ppm")
        for (let id = 0; id < cell.length; id++) {
            console.log(cell[id]);
            for (let j = 0; j < 6; j++) {
                const td = document.createElement("td")
                if (j === 0)
                    td.innerHTML = String.fromCharCode(65 + id)
                if (j === 1) {
                    setTimeout(() => {
                        td.innerHTML = String(times_arival[id])
                    }, 100)
                }
                if (j === 2) {
                    setTimeout(() => {
                        td.innerHTML = String(times_burst[id])
                    }, 100)
                }
                if (j === 3) {
                    setTimeout(() => {
                        td.innerHTML = String(finish_time[id])
                    }, 300)
                }
                if (j == 4) {
                    setTimeout(() => {
                        td.innerHTML = String(turnaround_time[id])
                    }, 300)
                }
                if (j == 5) {
                    setTimeout(() => {
                        td.innerHTML = String(waiting_time[id])
                    }, len * 403)
                }
                cell[id].appendChild(td)
            }
        }
        const table_chart_area = document.querySelector('.table-chart-ppm')
        const avg_trunaround = average(turnaround_time)
        const avg_waiting = average(waiting_time)
        const p = document.createElement('p')
        p.classList.add("average")
        p.innerHTML = `The average of turnaround time is <em> ${avg_trunaround} </em> and average of waiting time is <em> ${avg_waiting} </em>`
        table_chart_area.appendChild(p)
        // Grant Chart Logic
        const chart_row = document.querySelector('.chart-row-ppm')
        for (let i = 0; i < len; i++) {
            const td = document.createElement('td')
            td.innerHTML = String.fromCharCode(65 + i)
            td.style.width = String(times_burst[i] * 50) + "px";
            td.style.backgroundColor = getRandomColor()
            setTimeout(() => {
                chart_row.appendChild(td)
            }, i * 400)
        }

    })
    const modal = document.getElementById("modal-content-fcfs")
    const modalBtn = document.querySelector(".myBtn-fcfs")
    console.log(modal);
    modalBtn.addEventListener("click", () => {
        const hasDel = document.querySelector(".del") !== null
        if (hasDel) return;
        const p1 = document.createElement("p")
        p1.classList.add("del")
        const p2 = document.createElement("p")
        p2.classList.add("del")
        const hr = document.createElement("hr")
        hr.classList.add("del")
        p1.innerHTML = `Average <em>turnaround time </em> = (Exit time - Arrival time)`
        p2.innerHTML = `For example ${finish_time[0]} - ${times_arival[0]} = ${finish_time[0] - times_arival[0]}`
        modal.appendChild(p1)
        modal.appendChild(p2)
        modal.appendChild(hr)
        const p3 = document.createElement("p")
        p3.classList.add("del")
        const p4 = document.createElement("p")
        p4.classList.add("del")
        p3.innerHTML = `Average <em>waiting time </em> = (Turnaround time - Burst time)`
        p4.innerHTML = `For example ${turnaround_time[0]} - ${times_burst[0]} = ${turnaround_time[0] - times_burst[0]}`
        modal.appendChild(p3)
        modal.appendChild(p4)
    })
}

function myFunction() {
    const myconst = setTimeout(showPage, 1300);
}
function showPage() {
    document.getElementById("loader").style.display = "none";
    document.querySelector(".main-content").style.display = "grid";
}
function Main() {
    FCFS()
    PriorityScheduling_nonPreemptive()
    PriorityScheduling_Preemptive()
}

Main()

const modal = document.getElementById("myModal");

const btn = document.getElementById("myBtn");

const span = document.getElementsByClassName("close")[0];


btn.onclick = function () {
    modal.style.display = "block";
}
const del = document.querySelectorAll(".del")

span.onclick = function () {
    modal.style.display = "none";
    // for (let element of del) {
    //     element.parentNode.removeChild(element)
    // }
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}