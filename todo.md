Add handle of errors:
- (click) Node is either not visible or not an HTMLElement
- (hover) Node is detached from document
delete nth -> array matcher can handle it
Add screenshot of parent element
- change implementation of doubleClick (use clickoptions)
- delete cache !!!

Problems with elements cache. 
- every matchers action (module action) will return new instance of FoundElem(wchich caches found elem handle and not ignore Stale reference etc.)
- Create new class that represents FOUND element. And not ignore StaleReferenceElement exceptions. 
