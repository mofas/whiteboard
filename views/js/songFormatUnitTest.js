/*
  empty sourceCide test
*/
//init with 1 line
songFormatCompiler.setObjByPlainLyric("123abc");
songFormatCompiler.getSourceCode(); 
"123abc"

//with multi line
songFormatCompiler.setObjByPlainLyric("123\nabc\n");
songFormatCompiler.getSourceCode();
"123
abc
"
//with empty line
songFormatCompiler.setObjByPlainLyric("\n123\n\n\n\abc\n");
songFormatCompiler.getSourceCode();
"
123


abc
"
songFormatCompiler.getoutputFormat();
<div class="line"><span class='bar'>123</span></div><div class="line">&nbsp;</div><div class="line">&nbsp;</div><div class="line"><span class='bar'>abc</span></div>

//update lyric with new empty line
songFormatCompiler.setObjBySourceCode("123\n456\n");
songFormatCompiler.updateLyric("123\n456\n\n\n789");
songFormatCompiler.getSourceCode();
"123
456


789"





/*
  not empty sourceCode test
*/


//init
songFormatCompiler.setObjBySourceCode("[Am:3]123[Bm:1]456\n[C:2]789[D:1]000");
songFormatCompiler.getoutputFormat();
"<div class="line"><span class='bar'><span class='chord'>Am<span class='chordDuration'>X3</span></span>123</span><span class='bar'><span class='chord'>Bm<span class='chordDuration'>X1</span></span>456</span></div><div class="line"><span class='bar'><span class='chord'>C<span class='chordDuration'>X2</span></span>789</span><span class='bar'><span class='chord'>D<span class='chordDuration'>X1</span></span>000</span></div>"
songFormatCompiler.getPlainLyric();
"123456
789000"

//update lyric with less char
songFormatCompiler.updateLyric("23456\n789000");
songFormatCompiler.getoutputFormat();
"<div class="line"><span class='bar'><span class='chord'>Am<span class='chordDuration'>X3</span></span>234</span><span class='bar'><span class='chord'>Bm<span class='chordDuration'>X1</span></span>56</span></div><div class="line"><span class='bar'><span class='chord'>C<span class='chordDuration'>X2</span></span>789</span><span class='bar'><span class='chord'>D<span class='chordDuration'>X1</span></span>000</span></div>"

//update with more char
songFormatCompiler.updateLyric("11123456\n789000");
songFormatCompiler.getoutputFormat();
"<div class="line"><span class='bar'><span class='chord'>Am<span class='chordDuration'>X3</span></span>111</span><span class='bar'><span class='chord'>Bm<span class='chordDuration'>X1</span></span>23456</span></div><div class="line"><span class='bar'><span class='chord'>C<span class='chordDuration'>X2</span></span>789</span><span class='bar'><span class='chord'>D<span class='chordDuration'>X1</span></span>000</span></div>"

//update with more line
songFormatCompiler.updateLyric("123456\n789000\nabcdef");
songFormatCompiler.getoutputFormat();
"<div class="line"><span class='bar'><span class='chord'>Am<span class='chordDuration'>X3</span></span>123</span><span class='bar'><span class='chord'>Bm<span class='chordDuration'>X1</span></span>456</span></div><div class="line"><span class='bar'><span class='chord'>C<span class='chordDuration'>X2</span></span>789</span><span class='bar'><span class='chord'>D<span class='chordDuration'>X1</span></span>000</span></div><div class="line"><span class='bar'>abcdef</span></div>"

//update with less line
songFormatCompiler.setObjBySourceCode("[Am:3]123[Bm:1]456\n[C:2]789[D:1]000");
songFormatCompiler.updateLyric("123456");
songFormatCompiler.getoutputFormat();
"<div class="line"><span class='bar'><span class='chord'>Am<span class='chordDuration'>X3</span></span>123</span><span class='bar'><span class='chord'>Bm<span class='chordDuration'>X1</span></span>456</span></div><div class="line"><span class='bar'><span class='chord'>C<span class='chordDuration'>X2</span></span></span><span class='bar'><span class='chord'>D<span class='chordDuration'>X1</span></span></span></div>"

