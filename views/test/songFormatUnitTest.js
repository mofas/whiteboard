

describe("Set by plain Lyric with empty source code test", function() {

	it("Init with 1 line", function() {
		songFormatCompiler.setObjByPlainLyric("123abc");
	    expect(songFormatCompiler.getSourceCode()).toBe("123abc");
	    expect(songFormatCompiler.getoutputFormat()).toBe('<div class="line"><span class=\'bar\'>123abc</span></div>');
	});

	it("Multi line", function() {
  		songFormatCompiler.setObjByPlainLyric("123\nabc\n");
    	expect(songFormatCompiler.getSourceCode()).toBe("123\nabc\n");
    	expect(songFormatCompiler.getoutputFormat()).toBe('<div class="line"><span class=\'bar\'>123</span></div><div class="line"><span class=\'bar\'>abc</span></div>');
  	});

  	it("With empty line", function() {
  		songFormatCompiler.setObjByPlainLyric("\n123\n\n\n\abc\n");
    	expect(songFormatCompiler.getSourceCode()).toBe("\n123\n\n\n\abc\n");
    	expect(songFormatCompiler.getoutputFormat()).toBe('<div class="line"><span class=\'bar\'>123</span></div><div class="line">&nbsp;</div><div class="line">&nbsp;</div><div class="line"><span class=\'bar\'>abc</span></div>');
  	});

  	it("Update lyric with new empty line", function() {
  		songFormatCompiler.setObjBySourceCode("123\n456\n");
		songFormatCompiler.updateLyric("123\n456\n\n\n789");
		expect(songFormatCompiler.getSourceCode()).toBe("123\n456\n\n\n789");
  	});
	
});



describe("Not empty sourceCode test", function() {

	it("Init", function() {
		songFormatCompiler.setObjBySourceCode("[Am:3]123[Bm:1]456\n[C:2]789[D:1]000");
		expect(songFormatCompiler.getoutputFormat()).toBe('<div class="line"><span class=\'bar\'><span class=\'chord\'>Am<span class=\'chordDuration\'>X3</span></span>123</span><span class=\'bar\'><span class=\'chord\'>Bm<span class=\'chordDuration\'>X1</span></span>456</span></div><div class="line"><span class=\'bar\'><span class=\'chord\'>C<span class=\'chordDuration\'>X2</span></span>789</span><span class=\'bar\'><span class=\'chord\'>D<span class=\'chordDuration\'>X1</span></span>000</span></div>');
		expect(songFormatCompiler.getPlainLyric()).toBe("123456\n789000");
	});

	it("Update lyric with less char", function() {
		songFormatCompiler.setObjBySourceCode("[Am:3]123[Bm:1]456\n[C:2]789[D:1]000");
		songFormatCompiler.updateLyric("23456\n789000");
		expect(songFormatCompiler.getoutputFormat()).toBe('<div class="line"><span class=\'bar\'><span class=\'chord\'>Am<span class=\'chordDuration\'>X3</span></span>234</span><span class=\'bar\'><span class=\'chord\'>Bm<span class=\'chordDuration\'>X1</span></span>56</span></div><div class="line"><span class=\'bar\'><span class=\'chord\'>C<span class=\'chordDuration\'>X2</span></span>789</span><span class=\'bar\'><span class=\'chord\'>D<span class=\'chordDuration\'>X1</span></span>000</span></div>');
	});

	it("Update lyric with more char", function() {
		songFormatCompiler.setObjBySourceCode("[Am:3]123[Bm:1]456\n[C:2]789[D:1]000");
		songFormatCompiler.updateLyric("11123456\n789000");
		expect(songFormatCompiler.getoutputFormat()).toBe('<div class="line"><span class=\'bar\'><span class=\'chord\'>Am<span class=\'chordDuration\'>X3</span></span>111</span><span class=\'bar\'><span class=\'chord\'>Bm<span class=\'chordDuration\'>X1</span></span>23456</span></div><div class="line"><span class=\'bar\'><span class=\'chord\'>C<span class=\'chordDuration\'>X2</span></span>789</span><span class=\'bar\'><span class=\'chord\'>D<span class=\'chordDuration\'>X1</span></span>000</span></div>');
	});	

	it("Update with more line", function() {
		songFormatCompiler.setObjBySourceCode("[Am:3]123[Bm:1]456\n[C:2]789[D:1]000");
		songFormatCompiler.updateLyric("123456\n789000\nabcdef");
		expect(songFormatCompiler.getoutputFormat()).toBe('<div class="line"><span class=\'bar\'><span class=\'chord\'>Am<span class=\'chordDuration\'>X3</span></span>123</span><span class=\'bar\'><span class=\'chord\'>Bm<span class=\'chordDuration\'>X1</span></span>456</span></div><div class="line"><span class=\'bar\'><span class=\'chord\'>C<span class=\'chordDuration\'>X2</span></span>789</span><span class=\'bar\'><span class=\'chord\'>D<span class=\'chordDuration\'>X1</span></span>000</span></div><div class="line"><span class=\'bar\'>abcdef</span></div>');
	});

	it("Update with less line", function() {
		songFormatCompiler.setObjBySourceCode("[Am:3]123[Bm:1]456\n[C:2]789[D:1]000");
		songFormatCompiler.updateLyric("123456");
		expect(songFormatCompiler.getoutputFormat()).toBe('<div class="line"><span class=\'bar\'><span class=\'chord\'>Am<span class=\'chordDuration\'>X3</span></span>123</span><span class=\'bar\'><span class=\'chord\'>Bm<span class=\'chordDuration\'>X1</span></span>456</span></div><div class="line"><span class=\'bar\'><span class=\'chord\'>C<span class=\'chordDuration\'>X2</span></span></span><span class=\'bar\'><span class=\'chord\'>D<span class=\'chordDuration\'>X1</span></span></span></div>');
	});

});






describe("Update chord with empty model", function() {

	it("Init", function() {
		songFormatCompiler.setObjBySourceCode("");		
		var mockObj = [[{chordName: "Am" , chordDuration: 1 , chordPosition : 0 }]];
		songFormatCompiler.updateChord(mockObj);		
		expect(songFormatCompiler.getSourceCode()).toBe('[Am:1]');
	});

	it("2 bar in 1 line", function() {
		songFormatCompiler.setObjBySourceCode("");		
		var mockObj = [[{chordName: "Am" , chordDuration: 2 , chordPosition : 0 } ,
						{chordName: "G" , chordDuration: 2 , chordPosition : 0 }
					  ]];
		songFormatCompiler.updateChord(mockObj);		
		expect(songFormatCompiler.getSourceCode()).toBe('[Am:2][G:2]');
	});

	it("4 bar in 2 line", function() {
		songFormatCompiler.setObjBySourceCode("");		
		var mockObj = 
		[
			[
				{chordName: "Am" , chordDuration: 2 , chordPosition : 0 },
				{chordName: "G" , chordDuration: 2 , chordPosition : 1 }
			],
			[
				{chordName: "Cm" , chordDuration: 1 , chordPosition : 2 },
				{chordName: "B" , chordDuration: 3 , chordPosition : 3 }
			]
		];
		songFormatCompiler.updateChord(mockObj);		
		expect(songFormatCompiler.getSourceCode()).toBe('[Am:2][G:2]\n[Cm:1][B:3]');
	});

});


describe("Update chord with not empty model", function() {

	it("init" , function() {
		songFormatCompiler.setObjByPlainLyric("This is the end");		
		var mockObj = 
		[
			[
				{chordName: "Am" , chordDuration: 2 , chordPosition : 0 },				
			],			
		];		
		songFormatCompiler.updateChord(mockObj);				
		expect(songFormatCompiler.getSourceCode()).toBe('[Am:2]This is the end');		
	});

	it("init" , function() {
		songFormatCompiler.setObjByPlainLyric("This is the end");		
		var mockObj = 
		[
			[
				{chordName: "Am" , chordDuration: 2 , chordPosition : 0 },				
			],			
		];		
		songFormatCompiler.updateChord(mockObj);				
		expect(songFormatCompiler.getSourceCode()).toBe('[Am:2]This is the end');		
	});



});




