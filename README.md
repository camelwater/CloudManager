# Cloud Manager

Cloud Manager is a user-friendly cloud infrastructure management and operation tool integrated directly into Microsoft Teams.

## Roadmap

### Version 1.0
> Basic command-based bot with VM management functionality.
- [x] 4 commands to create, delete, start, and stop virtual machines.
- [x] Command list to show user available commands and proper usage.
- [x] Call GitHub REST API to manually trigger corresponding workflows based on the user's command.
- [x] GitHub actions executes the user's command in Azure.
- [x] Show GitHub API status to the user and the details of their command.
- [x] Support for other virtual machine commands, such as restarting and deallocation.
- [x] Azure SDK integration
- [ ] Show the GitHub workflow's status upon completion or failure.
- [ ] Return the Azure command's status back to the user upon completion or failure.

### Version 2.0
> More user-friendly messaging-extention based bot with greater cloud functionality.
- [ ] Bot utilises messaging-extention feature of Microsoft Teams.
- [ ] Users can select what operation they want to execute.
- [ ] Users can select from lists the required information and parameters of their Azure operation.
- [ ] Expanded support for other cloud services, such as resource groups and policies.
