import { RequestManager, TrackObject } from ".."

export abstract class Tracker {

    /**
     * Defines the user-readable name of the tracker
     */
    abstract name: String

    /**
     * Manages the ratelimits and the number of requests that can be done per second
     * This is also used to fetch pages when a chapter is downloading
     */
    readonly requestManager: RequestManager = createRequestManager({
      requestsPerSecond: 2.5,
      requestTimeout: 5000
    })

    /**
     * Returns a list of possible statuses that a tracker may support.
     * This generally is always an enum. The tracker will use {@link getStatus}
     * to convert from this enum value, to it's string representation
     */
    abstract getStatusList(): number[]

    /**
     * Returns a string representation of a provided status value.
     * Generally this is from an enum stored in the class, provided in {@link getStatusList}
     */
    abstract getStatus(status: number): string

    /**
     * This is the enum integer value representing what status is 'completed' by this source.
     * This will be one of the values retrieved from {@link getStatusList}
     */
    abstract getCompletionStatus(): number

    /**
     * For a given tracked object, retrieve the score from the tracker
     * and output it as a string
     */
    abstract displayScore(track: TrackObject): Promise<String>

    /**
     * Submit a TrackObject to the tracker. If the TrackObject is mutated
     * at any point during this operation, return it here.
     */
    abstract add(track: TrackObject): Promise<TrackObject>

    /**
     * Submit an update request for a submitted TrackObject.
     * If the object is mutated at any point, return it here.
     */
    abstract update(track: TrackObject): Promise<TrackObject>

    /**
     * Bind is an operation which when given a TrackerObject, makes a request to the tracker
     * and attempts to match it to a title which the tracker owns.
     * This TrackObject should have it's tracker_url and other relevent pieces of data updated
     * and then returned.
     */
    abstract bind(track: TrackObject): Promise<TrackObject>

    /**
     * Given a TrackObject, communicate to the Tracker and refresh the data with what the server
     * has to provide. Return the mutated object.
     */
    abstract refresh(track: TrackObject): Promise<TrackObject>

    /**
     * Log in to the tracker with the provided username and password.
     * If this tracker needs to use oauth, it should be handled inside of this
     * function.
     */
    abstract login(username: String, password: String): Promise<void>

}