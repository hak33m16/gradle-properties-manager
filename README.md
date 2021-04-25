# Gradle Properties Manager

The globally available `~/.gradle/gradle.properties` is often used to alter values for a particular team or project within organizations. Manual management of this file is cumbersome, so this node module aims to ease that burden.

-   [Gradle Properties Manager](#gradle-properties-manager)
    -   [Installation](#installation)
    -   [Usage](#usage)
        -   [Initialization](#initialization)
        -   [Managing Profiles](#managing-profiles)
        -   [Examples](#examples)
    -   [Shell Integration](#shell-integration)
        -   [Powerlevel10k](#powerlevel10k)

## Installation

```bash
npm install -g gradle-properties-manager
```

## Usage

Executable available as `gradle-properties-manager`

It's highly recommended, and will be assumed throughout this guide that you create an alias which points to it called `gpm`. To do this, you can add the following to your `~/.bashrc` or `~/.zshrc`:

```bash
alias gpm='gradle-properties-manager'
```

### Overview

```
Usage: gradle-properties-manager [options] [command]

Options:
  -h, --help      display help for command

Commands:
  profile         Manage profiles
  property        Manage properties
  init            Initialize gpm for first-time use
  help [command]  display help for command
```

Run any of the above commands with the `--help` flag or as `gpm help <command>` for more info on usage

### Initialization

To start using gpm, first run `gpm init`

You'll be taken through a series of prompts where you'll have the option to back up your current `~/.gradle/gradle.properties` file to `~/.gradle/gradle.properties.bak`, as well as move existing properties in your `gradle.properties` file over to gpm

### Managing Profiles

```
Usage: gradle-properties-manager-profile [options] [command]

Get the name of the current profile

Options:
  -h, --help     display help for command

Commands:
  create [name]  Add a new profile with the given name
  set [name]     Switch to an existing profile
  delete [name]  Remove an existing profile with the given name
  ls             List all known profiles
```

### Managing Properties

### Examples

## Shell Integration

The name of the current profile is always available in `~/.gpm/profile`

### Powerlevel10k

For an easy and immediate addition to your shell, you can add the following to your `~/.zshrc`:

```
function prompt_my_gpm_profile() {
    if [[ -e "$HOME/.gpm/profile" ]] ; then
        # icon is unicode char 'e738' which is the java icon in nerd fonts
        p10k segment -i '' -f 208 -t "$(cat ~/.gpm/profile)"
    fi
}
POWERLEVEL9K_RIGHT_PROMPT_ELEMENTS+=my_gpm_profile
```

However, if you'd like to change the order of your prompt element, you'll have to enter the `my_gpm_profile` signature into the appropriate location in your `~/.p10k.zsh` file's `POWERLEVEL9K_RIGHT_PROMPT_ELEMENTS` array
