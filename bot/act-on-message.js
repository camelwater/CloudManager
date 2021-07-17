"use strict";

const {
    createVM,
    stopVM, 
    startVM,
    deleteVM,
    restartVM,
    deallocateVM,
    showVM
} = require("./github-utils/vm-workflows");
// const { getVMS , getRunningVMS } = require("./get-vms");

const valid_commands = ['start', 'stop', 'delete', 'create', 'restart', 'deallocate', 'show'];

module.exports.actOnMessage = async (context) => {
    const message = context.activity.text.trim();

    // console.log(message);

    const params = message.split(" ");

    if (params.length<1)
        // return await context.sendActivity("Please include a command.");
        return;

    const commandType = params[0].toLocaleLowerCase();
    params.splice(0,1);
    
    if (commandType === "create"){
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
        
    else if (commandType === "delete" || commandType === "del"){
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
    else if (commandType === "start"){
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
    else if(commandType === "stop"){
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
    else if(commandType === "restart"){
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
    else if(commandType === "deallocate"){
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
    else if (commandType === "show"){
        const usage = "**Usage:** show [VM-name] [Resource-Group]"

        if (params.length < 1)
            return await context.sendActivity("Here's how to use this command:\n\n" + usage);
        if(params.length < 2)
            return await context.sendActivity("You are missing required arguments.\n\n" + usage);
        // if (params.length < 2)
        //     return await context.sendActivity(getRunningVMS(vNet));
        const name = params[0];
        const group = params[1];

        await context.sendActivity(
            "**Retrieving VM instance details**:" + 
            `\n\nName: ${name}` +
            `\n\nin resource group: ${group}` 
        );
        // TODO: implement Azure SDK
    }
    else{
        await context.sendActivity("That is not a valid command. Valid commands: " + valid_commands.join(", "));
        return;
    }
    
};