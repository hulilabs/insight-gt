## Pull Request Checklist

**For the requester:**
Please make sure that your code complies with our best practices (_Huli Standards_)

### Documentation Standards
- [ ] Every component, behavior and utility provides at least a readme.md for reference
- [ ] Tables are used to list parameters, objects definitions or any other composed structure

### JSDOCS Standards
- [ ] Defines `typedef` for objects on `@param` and `@returns` values

### Compatibility
- [ ] Component renders and behaves as expected on mobile devices (ideally tested on tablets too)

### Styles
- [ ] BEM (blocks, elements, modifiers) + ITCSS (folder structure)
- [ ] Component colors should be variables in the file `settings/_components`
- [ ] Component animations considers browser optimizations
- [ ] Component styles definition uses `compass/css3` mixins for animations, transformation, appearance, etc
