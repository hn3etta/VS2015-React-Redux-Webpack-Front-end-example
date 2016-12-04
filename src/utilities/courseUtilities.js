export function sortByTitle(courseA, courseB) {
    return courseA.get("title").localeCompare(courseB.get("title"));
}