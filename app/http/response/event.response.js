function EventResponse(event) {
  return {
    id: event.uuid,
    title: event.title,
    description: event.description,
    schedule_type: event.schedule_type,
    locations: event.locations,
    event_image: event.event_image,
    additional_images: event.event_additional_images,
    status: event.status
  }
}

function EventCollectionResponse(events) {
  return events.map((event) => {
    return EventResponse(event)
  })
}

module.exports = {EventResponse, EventCollectionResponse}