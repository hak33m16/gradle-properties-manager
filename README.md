# Gradle Properties Manager

## About

The globally available `~/.gradle/gradle.properties` is often used to alter values for a particular team or project within organizations. Manual management of this file is cumbersome, so this node module aims to ease that burden.

## Installation

`npm install -g gradle-properties-manager`

OR

`yarn global add gradle-properties-manager`

## Usage

Executable available as `gradle-properties-manager` as well as `gpm`

### Initializing the Properties Manager

When first using the property manager, it's a good idea to back up your current `~/.gradle/gradle.properties` file. The `--init` flag will:

- Backup your current `gradle.properties` file to `~/.gradle/gradle.properties.bak`
- Create a `~/.gpm` folder where your profiles will be stored

### Managing Profiles

- To create a profile:
  `gpm --create-profile my-custom-profile`

_Note: The profile name is just an alias for the `.properties` file that it's stored in. Avoid using slashes or invalid filesystem characters in general for profile names_

- To list all available profiles:
  `gpm --profiles`

- To switch profiles:
  `gpm --profile my-custom-profile`

### Managing Properties

When a property is added via the CLI, it's automatically added to whatever the current profile is set to:
`gpm --property myspecialkey=myspecialvalue`

In our case, this would set this property inside of our `my-custom-profile.properties` file inside of `~/.gpm`

If you'd like to add this property to the global profile, just add the `--global` flag when adding via the `--property` argument
