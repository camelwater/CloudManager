"use strict";

const azure_creds = require("./azure_creds.json")

const msRestAzure = require("@azure/ms-rest-nodeauth");
const { ComputeManagementClient } = require("@azure/arm-compute");
const { StorageManagementClient } = require("@azure/arm-storage");
const { NetworkManagementClient } = require("@azure/arm-network");
const { ResourceManagementClient } = require("@azure/arm-resources");

const clientID = azure_creds.CLIENT_ID;
const tenantID = azure_creds.TENANT_ID;
const subscriptionID = azure_creds.SUBSCRIPTION_ID;
const secret = azure_creds.APPLICATION_SECRET;

// resourceClient = new ResourceManagementClient(credentials, subscriptionID);
// computeClient = new ComputeManagementClient(credentials, subscriptionID);
// storageClient = new StorageManagementClient(credentials, subscriptionID);
// networkClient = new NetworkManagementClient(credentials, subscriptionID);


function subnetName() {
    return "Subnet-001"; // hardcoded here for now because too lazy
}

module.exports.showVM = async(vmName, resourceGroupName) => {
    
    const credentials = await msRestAzure.loginWithServicePrincipalSecret(clientID, secret, tenantID);
    const computeClient = new ComputeManagementClient(credentials, subscriptionID);

    return await computeClient.virtualMachines.get(resourceGroupName, vmName);
};

module.exports.listVMs = async () => {
   
    const credentials = await msRestAzure.loginWithServicePrincipalSecret(clientID, secret, tenantID);
    const computeClient = new ComputeManagementClient(credentials, subscriptionID);

    return await computeClient.virtualMachines.listAll();
    
};

module.exports.createRG = async(name, location, tags) => {
    const params = { location: location, tags: tags};
    const credentials = await msRestAzure.loginWithServicePrincipalSecret(clientID, secret, tenantID);
    const resourceClient = new ResourceManagementClient(credentials, subscriptionID);

    return await resourceClient.resourceGroups.createOrUpdate(name, params);
    
};

module.exports.createVNET = async(resourceGroup, name, params) => {
    const par = params!==null ? params : {
        location: location,
        addressSpace: {
        addressPrefixes: ['10.0.0.0/16']
        },
        dhcpOptions: {
        dnsServers: ['10.1.1.1', '10.1.2.4']
        },
        subnets: [{ name: subnetName(), addressPrefix: '10.0.0.0/24' }],
    };
    const credentials = msRestAzure.loginWithServicePrincipalSecret(clientID, secret, tenantID);
    const computeClient = new ComputeManagementClient(credentials, subscriptionID);

    return await computeClient.virtualNetworks.createOrUpdate(resourceGroup, name, par);
  
};
