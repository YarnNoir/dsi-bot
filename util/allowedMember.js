module.exports = (member) => {
  const staff = [
    ...process.env.STAFF_ROLE.split(","),
    `${process.env.VERIFY_ROLE}`,
  ]

  const m = member?._roles.find((role) => staff.includes(role))
  return !!m
}
