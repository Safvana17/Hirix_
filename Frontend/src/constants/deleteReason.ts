const DeleteReason = {
  TOO_EXPENSIVE: 'TOO_EXPENSIVE',
  BUGS: 'BUGS',
  NOT_USEFUL: 'NOT_USEFUL',
  SWITCHED_PLATFORM:'SWITCHED_PLATFORM',
  OTHER: 'OTHER'
}

export type DeleteReason = typeof DeleteReason[keyof typeof DeleteReason]