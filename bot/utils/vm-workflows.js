"use strict";


const { runWorkflow } = require("./github-api");

module.exports.createVM = async (name, group, vnet, subnet, image) => {
    const workflow_file = "CW3-DEMO-CREATE";
    const inputs = {
        "vm_name": name,
        "resource_group": group,
        "vnet": vnet,
        "subnet": subnet,
        "image": image
    };
    return runWorkflow(workflow_file, inputs);
};

module.exports.deleteVM = async (name, group) => {
    const workflow_file = "CW3-DEMO-DELETE";
    const inputs = {
        "vm_name": name,
        "resource_group": group
    };
    return runWorkflow(workflow_file, inputs);
};

module.exports.stopVM = async (name, group) => {
    const workflow_file = "CW3-DEMO-STOP";
    const inputs = {
        "vm_name": name,
        "resource_group": group
    }; 
    return runWorkflow(workflow_file, inputs);
};

module.exports.startVM = async (name, group) => {
    const workflow_file = "CW3-DEMO-START";
    const inputs = {
        "vm_name": name,
        "resource_group": group
    };
    return runWorkflow(workflow_file, inputs);
};

module.exports.restartVM = async (name, group) => {
    const workflow_file = "CW3-DEMO-RESTART";
    const inputs = {
        "vm_name": name,
        "resource_group": group
    };
    return runWorkflow(workflow_file, inputs);
};

module.exports.deallocateVM = async (name, group) => {
    const workflow_file = "CW3-DEMO-DEALLOCATE";
    const inputs = {
        "vm_name": name,
        "resource_group": group
    };
    return runWorkflow(workflow_file, inputs);
};



