# Cloud Manager

Cloud Manager is a user-friendly cloud infrastructure operation tool integrated directly into Microsoft Teams. \
By executing some simple commands or using Microsoft Teams's messaging extension feature, anyone can quickly and easily manage their Azure environments without ever leaving Teams.

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
- [x] Show the GitHub workflow's status upon completion or failure.
- [ ] Return the Azure command's status back to the user upon completion or failure.

### Version 2.0
> More user-friendly card-based bot with greater cloud functionality.
- [x] Expanded support for other cloud services, such as resource groups and policies.
- [ ] Bot utilises Microsoft Teams's cards.
- [ ] Users can select what operation they want to execute or type it in chronologically.
- [ ] Users can select required information and parameters of their Azure operation.

