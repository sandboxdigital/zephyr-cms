import Quill from 'quill'

var Delta = Quill.import('delta');
let Break = Quill.import('blots/break');
let Embed = Quill.import('blots/embed');

function lineBreakMatcher() {
    var newDelta = new Delta();
    newDelta.insert({'break': ''});
    return newDelta;
}

class SmartBreak extends Break {
    length () {
        return 1
    }
    value () {
        return '\n'
    }
    insertInto(parent, ref) {
        Embed.prototype.insertInto.call(this, parent, ref)
    }
}

SmartBreak.blotName = 'break';
SmartBreak.tagName = 'BR'

Quill.register(SmartBreak)

var options = {
    modules: {
        clipboard: {
            matchers: [
                ['BR', lineBreakMatcher]
            ]
        },
        keyboard: {
            bindings: {
                linebreak: {
                    key: 13,
                    shiftKey: true,
                    handler: function (range) {
                        let currentLeaf = this.quill.getLeaf(range.index)[0]
                        let nextLeaf = this.quill.getLeaf(range.index + 1)[0]

                        this.quill.insertEmbed(range.index, 'break', true, 'user');

                        // Insert a second break if:
                        // At the end of the editor, OR next leaf has a different parent (<p>)
                        // if (nextLeaf === null || (currentLeaf.parent !== nextLeaf.parent)) {
                        //     console.log('EXTRA');
                        //     console.log(currentLeaf);
                        //     console.log(nextLeaf);
                        //     this.quill.insertEmbed(range.index, 'break', true, 'user');
                        // }

                        // Now that we've inserted a line break, move the cursor forward
                        this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
                    }
                }
            }
        }
    }
};

// var quill = new Quill('.editor', options);
//
// var length = quill.getLength()
// var text = quill.getText(length - 2, 2)
//
// // Remove extraneous new lines
// if (text === '\n\n') {
//     quill.deleteText(quill.getLength() - 2, 2)
// }

export default options;
