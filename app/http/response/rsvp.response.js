
function RsvpResponse(rsvp) {
  return {
    id: rsvp.uuid,
    name: rsvp.name,
    phone_number: rsvp.phone_number,
    email: rsvp.email,
    invitees: rsvp.invitees,
    type: rsvp.type,
    locations: rsvp.locations,
    code: rsvp.code,
    status: rsvp.status,
    createdAt: rsvp.createdAt
  }
}

function RsvpCollectionResponse(rsvps) {

  return rsvps.map((rsvp) => {
    return RsvpResponse(rsvp)
  })
}

module.exports = {RsvpResponse, RsvpCollectionResponse}