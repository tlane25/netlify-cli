import { OptionValues } from 'commander'
import inquirer from 'inquirer'

import { ADDON_VALIDATION, prepareAddonCommand } from '../../utils/addons/prepare.js'
import { error, exit, log, APIError } from '../../utils/command-helpers.js'
import BaseCommand from '../base-command.js'

export const addonsDelete = async (addonName: string, options: OptionValues, command: BaseCommand) => {
  const { addon } = await prepareAddonCommand({
    command,
    addonName,
    validation: ADDON_VALIDATION.EXISTS,
  })
  if (!options.force && !options.f) {
    const { wantsToDelete } = await inquirer.prompt({
      type: 'confirm',
      name: 'wantsToDelete',
      message: `Are you sure you want to delete the ${addonName} add-on? (to skip this prompt, pass a --force flag)`,
      default: false,
    })
    if (!wantsToDelete) {
      exit()
    }
  }

  try {
    await command.netlify.api.deleteServiceInstance({
      siteId: command.netlify.site.id,
      addon: addonName,
      instanceId: addon.id,
    })
    log(`Addon "${addonName}" deleted`)
  } catch (error_) {
    error((error_ as APIError).message)
  }
}
