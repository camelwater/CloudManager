"use strict";

const {
    createVM,
    stopVM, 
    startVM,
    deleteVM,
    restartVM,
    deallocateVM,
} = require("./github-utils/vm-workflows");

const { 
    showVM, 
    listVMs,
    createRG,
    deleteRG,
    createVNET
} = require("./azure/azure-api");
// const { getVMS , getRunningVMS } = require("./get-vms");

const valid_categories = ["vm", "rg"];

module.exports.actOnMessage = async (context) => {
    const message = context.activity.text.trim();
    // console.log(message);

    if (message.length < 1)
        return await context.sendActivity("**Usage:** [commandCategory] [command] [commandParameters]\n\nValid command categories: " + valid_categories.join(", "));

    const params = message.split(" ");

    const category = params[0].toLocaleLowerCase();
    let command = "none";
    if (valid_categories.includes(category)) {
        try {
            command = params[1].toLocaleLowerCase();
        } catch(error) {
            command = "none";
        }
        params.splice(0, 2); 
    }
    else
        return await context.sendActivity(`That is not a valid category. Valid categories: ${valid_categories.join(", ")}`);

    if (category === "vm") {
        const vm_commands = ["create", "delete", "start", "stop", "restart", "deallocate", "show"];
        
        if (command === "none") {
            return await context.sendActivity("VM commands: " + vm_commands.join(", "));
        }
        if (!vm_commands.includes(command)) {
            await context.sendActivity("That is not a valid VM command. Valid VM commands: " + vm_commands.join(", "));
        }

        if (command === "create"){
            const usage = "**Usage:** create [VM-Name] [Resource-Group] [V-net] [Sub-net] [image]";
            const valid_images = ['ubuntu', 'windows'];

            if (params.length === 0)
                return await context.sendActivity("Here's how to use this command:\n\n" + usage);
            if (params.length < 4)
                return await context.sendActivity("You are missing required arguments.\n\n" + usage);

            const name = params[0];
            const group = params[1];
            const net = params[2];
            const sub_net = params[3];
            let image = params.length>4 ? params[4] : "Ubuntu"; //default to Ubuntu (hardcoded for MVP)

            if (!valid_images.includes(image.toLocaleLowerCase()) && image.toLocaleLowerCase() !== "ubuntults")
                return await context.sendActivity(image + ` is not a valid image. Valid images: ${valid_images.join(', ')}.\n\n`+usage);

            if(image.toLocaleLowerCase().includes('ubuntu') && image.toLocaleLowerCase() !== "ubuntults")
                image = "UbuntuLTS";
            

            await context.sendActivity(
                "**Creating new VM instance:**" + 
                `\n\nName: ${name}` +
                `\n\nResource group: ${group}` +
                `\n\nVirtual network: ${net}` + 
                `\n\nSubnet: ${sub_net}` + 
                `\n\nImage: ${image}` + 
                "\n\n\n\n**Please wait...**"
            );
            const resp = await createVM(name, group, net, sub_net, image);
            await context.sendActivity("GitHub API response status: " + String(resp.status) + (resp.status===204 ? " (Normal)" : " (Error)"))
        }
            
        else if (command === "delete" || command === "del"){
            const usage = "**Usage:** delete [VM-Name] [Resource-Group]"

            if (params.length == 0)
                return await context.sendActivity("Here's how to use this command:\n\n" + usage);
            if (params.length<2)
                return await context.sendActivity("You are missing required arguments.\n\n" + usage);
            // if (params.length<2)
            //     return await context.sendActivity(getVMS(vNet));
            const name = params[0];
            const group = params[1];

            await context.sendActivity(
                "**Deleting VM instance:**" + 
                `\n\nName: ${name}` +
                `\n\nin resource group: ${group}` 
            );

            const resp = await deleteVM(name, group);
            await context.sendActivity("GitHub API response status: " + String(resp.status) + (resp.status===204 ? " (Normal)" : " (Error)"))
        }
        else if (command === "start"){
            const usage = "**Usage:** start [VM-name] [Resource-Group]";

            if (params.length < 1)
                return await context.sendActivity("Here's how to use this command:\n\n" + usage);
            if (params.length <2)
                return await context.sendActivity("You are missing required arguments.\n\n"+ usage);
            // if (params.length < 2)
            //     return await context.sendActivity(getVMS(vNet));
            const name = params[0];
            const group = params[1];

            await context.sendActivity(
                "**Starting VM instance:**" + 
                `\n\nName: ${name}` +
                `\n\nin resource group: ${group}` 
            );
            const resp = await startVM(name, group);
            await context.sendActivity("GitHub API response status: " + String(resp.status) + (resp.status===204 ? " (Normal)" : " (Error)"))
        }
        else if(command === "stop"){
            const usage = "**Usage:** stop [VM-name] [Resource-Group]";

            if (params.length < 1)
                return await context.sendActivity("Here's how to use this command:\n\n" + usage);
            if(params.length < 2)
                return await context.sendActivity("You are missing required arguments.\n\n" + usage);
            // if (params.length < 2)
            //     return await context.sendActivity(getRunningVMS(vNet));
            const name = params[0];
            const group = params[1];

            await context.sendActivity(
                "**Stopping VM instance**:" + 
                `\n\nName: ${name}` +
                `\n\nin resource group: ${group}` 
            );
            const resp = await stopVM(name, group);
            await context.sendActivity("GitHub API response status: " + String(resp.status) + (resp.status===204 ? " (Normal)" : " (Error)"))
        }
        else if(command === "restart"){
            const usage = "**Usage:** restart [VM-name] [Resource-Group]"

            if (params.length < 1)
                return await context.sendActivity("Here's how to use this command:\n\n" + usage);
            if(params.length < 2)
                return await context.sendActivity("You are missing required arguments.\n\n" + usage);
            // if (params.length < 2)
            //     return await context.sendActivity(getRunningVMS(vNet));
            const name = params[0];
            const group = params[1];

            await context.sendActivity(
                "**Restarting VM instance**:" + 
                `\n\nName: ${name}` +
                `\n\nin resource group: ${group}` 
            );
            const resp = await restartVM(name, group);
            await context.sendActivity("GitHub API response status: " + String(resp.status) + (resp.status===204 ? " (Normal)" : " (Error)"))

        }
        else if(command === "deallocate"){
            const usage = "**Usage:** deallocate [VM-name] [Resource-Group]"

            if (params.length < 1)
                return await context.sendActivity("Here's how to use this command:\n\n" + usage);
            if(params.length < 2)
                return await context.sendActivity("You are missing required arguments.\n\n" + usage);
            // if (params.length < 2)
            //     return await context.sendActivity(getRunningVMS(vNet));
            const name = params[0];
            const group = params[1];

            await context.sendActivity(
                "**Deallocating VM instance**:" + 
                `\n\nName: ${name}` +
                `\n\nin resource group: ${group}` 
            );
            const resp = await deallocateVM(name, group);
            await context.sendActivity("GitHub API response status: " + String(resp.status) + (resp.status===204 ? " (Normal)" : " (Error)"))
        }
        else if (command === "show"){
            const usage = "**Usage:** show [VM-name] [Resource-Group]"

            if (params.length < 1)
                return await context.sendActivity("Here's how to use this command:\n\n" + usage);
            if(params.length < 2)
                return await context.sendActivity("You are missing required arguments.\n\n" + usage);
            
            const name = params[0];
            const group = params[1];

            let sentID = await context.sendActivity(
                "**Retrieving VM instance details**:" + 
                `\n\nName: ${name}` +
                `\n\nin resource group: ${group}` 
            );
            const res = await showVM(name, group);
            await context.deleteActivity(sentID.id);
            await context.sendActivity(`**${ name }** in **${ group }** details:\n\n` + JSON.stringify(res, null, 4));
        }
        
    }
    else if (category === "rg") {
        const rg_commands = ["create", "delete"];

        if (command === "none") {
            return await context.sendActivity("RG commands: " + rg_commands.join(", "));
        }
        if (!rg_commands.includes(command))
            return await context.sendActivity("That is not a valid RG command.\n\nValid RG commands: " + rg_commands.join(", "))

        if (command === "create") {
            const usage = "**Usage:** rg create [RG-name] [location]";

            if (params.length < 1) {
                return await context.sendActivity("Here's how to use this command:\n\n" + usage);
            }
            if (params.length < 2) {
                return await context.sendActivity("You are missing required arguments.\n\n" + usage);
            }

            const name = params[0];
            const location = params[1];
            const tags = params.length > 2 ? params[2]: null;

            const res = await createRG(name, location, tags)
            await context.sendActivity(`RG **${ name } created.`)
        }
        else if (command === "delete") {
            const usage = "**Usage:** rg delete [RG-name]";

            if (params.length < 1) {
                return await context.sendActivity("Here's how to use this command:\n\n" + usage);
            }
            if (params.length < 2) {
                return await context.sendActivity("You are missing required arguments.\n\n" + usage);
            }

            const name = params[0];

            const res = await deleteRG(name)
            await context.sendActivity(`RG **${ name } deletion successfully begun.`)
        }
    }
    else {
        // non-categorized/non-grouped commands
    }
    
};