import {Snackbar, StyleProvider, Themes} from "@varlet/ui";

export default () =>{
    console.log('init')
    Snackbar.allowMultiple(true)
    StyleProvider(Themes.md3Dark)
}