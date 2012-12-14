
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
		expect(songFormatCompiler.getoutputFormat()).toBe('<div class="line"><span class=\'bar\'><span class=\'chord\'>Am<span class=\'chordDuration\'>X3</span></span>123</span><span class=\'bar\'><span class=\'chord\'>Bm</span>456</span></div><div class="line"><span class=\'bar\'><span class=\'chord\'>C<span class=\'chordDuration\'>X2</span></span>789</span><span class=\'bar\'><span class=\'chord\'>D</span>000</span></div>');
		expect(songFormatCompiler.getPlainLyric()).toBe("123456\n789000");
	});

	it("Update lyric with less char", function() {
		songFormatCompiler.setObjBySourceCode("[Am:3]123[Bm:1]456\n[C:2]789[D:1]000");
		songFormatCompiler.updateLyric("23456\n789000");
		expect(songFormatCompiler.getoutputFormat()).toBe('<div class="line"><span class=\'bar\'><span class=\'chord\'>Am<span class=\'chordDuration\'>X3</span></span>234</span><span class=\'bar\'><span class=\'chord\'>Bm</span>56</span></div><div class="line"><span class=\'bar\'><span class=\'chord\'>C<span class=\'chordDuration\'>X2</span></span>789</span><span class=\'bar\'><span class=\'chord\'>D</span>000</span></div>');
	});

	it("Update lyric with more char", function() {
		songFormatCompiler.setObjBySourceCode("[Am:3]123[Bm:1]456\n[C:2]789[D:1]000");
		songFormatCompiler.updateLyric("11123456\n789000");
		expect(songFormatCompiler.getoutputFormat()).toBe('<div class="line"><span class=\'bar\'><span class=\'chord\'>Am<span class=\'chordDuration\'>X3</span></span>111</span><span class=\'bar\'><span class=\'chord\'>Bm</span>23456</span></div><div class="line"><span class=\'bar\'><span class=\'chord\'>C<span class=\'chordDuration\'>X2</span></span>789</span><span class=\'bar\'><span class=\'chord\'>D</span>000</span></div>');
	});	

	it("Update with more line", function() {
		songFormatCompiler.setObjBySourceCode("[Am:3]123[Bm:1]456\n[C:2]789[D:1]000");
		songFormatCompiler.updateLyric("123456\n789000\nabcdef");
		expect(songFormatCompiler.getoutputFormat()).toBe('<div class="line"><span class=\'bar\'><span class=\'chord\'>Am<span class=\'chordDuration\'>X3</span></span>123</span><span class=\'bar\'><span class=\'chord\'>Bm</span>456</span></div><div class="line"><span class=\'bar\'><span class=\'chord\'>C<span class=\'chordDuration\'>X2</span></span>789</span><span class=\'bar\'><span class=\'chord\'>D</span>000</span></div><div class="line"><span class=\'bar\'>abcdef</span></div>');
	});

	it("Update with less line", function() {
		songFormatCompiler.setObjBySourceCode("[Am:3]123[Bm:1]456\n[C:2]789[D:1]000");
		songFormatCompiler.updateLyric("123456");
		expect(songFormatCompiler.getoutputFormat()).toBe('<div class="line"><span class=\'bar\'><span class=\'chord\'>Am<span class=\'chordDuration\'>X3</span></span>123</span><span class=\'bar\'><span class=\'chord\'>Bm</span>456</span></div><div class="line"><span class=\'bar\'><span class=\'chord\'>C<span class=\'chordDuration\'>X2</span></span></span><span class=\'bar\'><span class=\'chord\'>D</span></span></div>');
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
		var mockObj = 
		[
			[
				{chordName: "Am" , chordDuration: 2 , chordPosition : 0 } ,
				{chordName: "G" , chordDuration: 2 , chordPosition : 0 }
		  	]
		];
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


describe("Update chord with plain lyric", function() {

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


	it("first chord not at the position 0", function() {
		songFormatCompiler.setObjByPlainLyric("This is the end");
		var mockObj = 
		[
			[
				{chordName: "Am" , chordDuration: 2 , chordPosition : 4 }
			]
		];
		songFormatCompiler.updateChord(mockObj);		
		expect(songFormatCompiler.getSourceCode()).toBe('This[Am:2] is the end');
	});

	it("1 line lyric , 2 chord" , function() {
		songFormatCompiler.setObjByPlainLyric("This is the end");		
		var mockObj = 
		[
			[
				{chordName: "Am" , chordDuration: 2 , chordPosition : 0 },
				{chordName: "G" , chordDuration: 2 , chordPosition : 8 },
			],			
		];
		songFormatCompiler.updateChord(mockObj);				
		expect(songFormatCompiler.getSourceCode()).toBe('[Am:2]This is [G:2]the end');		
	});

	it("1 line lyric , 2 chord , out of boundary" , function() {
		songFormatCompiler.setObjByPlainLyric("讓我將妳心兒摘下");		
		var mockObj = 
		[
			[
				{chordName: "Am" , chordDuration: 1 , chordPosition : 0 },
				{chordName: "B" , chordDuration: 1 , chordPosition : 18 }
			],			
		];
		songFormatCompiler.updateChord(mockObj);				
		expect(songFormatCompiler.getSourceCode()).toBe('[Am:1]讓我將妳心兒摘下[B:1]');
	});

	


	it("1 line lyric , 3 chord , out of origin lyric bound" , function() {
		songFormatCompiler.setObjByPlainLyric("This is the end");		
		var mockObj = 
		[
			[
				{chordName: "Am" , chordDuration: 2 , chordPosition : 0 },
				{chordName: "G" , chordDuration: 2 , chordPosition : 8 },
				{chordName: "D" , chordDuration: 1 , chordPosition : 18 }
			],			
		];
		songFormatCompiler.updateChord(mockObj);				
		expect(songFormatCompiler.getSourceCode()).toBe('[Am:2]This is [G:2]the end[D:1]');
	});

	it("1 line lyric , 4 chord , out of origin lyric bound" , function() {
		songFormatCompiler.setObjByPlainLyric("This is the end");		
		var mockObj = 
		[
			[
				{chordName: "Am" , chordDuration: 2 , chordPosition : 0 },
				{chordName: "G"  , chordDuration: 2 , chordPosition : 8 },
				{chordName: "D"  , chordDuration: 1 , chordPosition : 18 },
				{chordName: "Cm" , chordDuration: 2 , chordPosition : 24 },
			],			
		];
		songFormatCompiler.updateChord(mockObj);				
		expect(songFormatCompiler.getSourceCode()).toBe('[Am:2]This is [G:2]the end[D:1][Cm:2]');
	});

	it("1 line lyric , 4 chord in 2 line" , function() {
		songFormatCompiler.setObjByPlainLyric("This is the end");		
		var mockObj = 
		[
			[
				{chordName: "Am" , chordDuration: 2 , chordPosition : 0 },
				{chordName: "G"  , chordDuration: 2 , chordPosition : 8 }
			],
			[
				{chordName: "D"  , chordDuration: 1 , chordPosition : 0 },
				{chordName: "Cm" , chordDuration: 2 , chordPosition : 12 }
			]		
		];
		songFormatCompiler.updateChord(mockObj);			
		expect(songFormatCompiler.getSourceCode()).toBe('[Am:2]This is [G:2]the end\n[D:1][Cm:2]');
	});

	it("2 line lyric , 4 chord in 2 line" , function() {
		songFormatCompiler.setObjByPlainLyric("This is the end\nHold your breath and count to ten\n");

		var mockObj = 
		[
			[
				{chordName: "Am" , chordDuration: 2 , chordPosition : 0 },
				{chordName: "G"  , chordDuration: 2 , chordPosition : 8 }
			],
			[
				{chordName: "D"  , chordDuration: 1 , chordPosition : 0 },
				{chordName: "Cm" , chordDuration: 2 , chordPosition : 12 }
			]
		];
		songFormatCompiler.updateChord(mockObj);		
		expect(songFormatCompiler.getSourceCode()).toBe('[Am:2]This is [G:2]the end\n[D:1]Hold your br[Cm:2]eath and count to ten');
	});


	it("2 line lyric , 5 chord in 3 line" , function() {
		songFormatCompiler.setObjByPlainLyric("This is the end\nHold your breath and count to ten\n");

		var mockObj = 
		[
			[
				{chordName: "Am" , chordDuration: 2 , chordPosition : 0 },
				{chordName: "G"  , chordDuration: 2 , chordPosition : 8 }
			],
			[
				{chordName: "D"  , chordDuration: 1 , chordPosition : 0 },
				{chordName: "Cm" , chordDuration: 2 , chordPosition : 12 }
			],
			[
				{chordName: "#F"  , chordDuration: 1 , chordPosition : 0 }				
			]
		];
		songFormatCompiler.updateChord(mockObj);		
		expect(songFormatCompiler.getSourceCode()).toBe('[Am:2]This is [G:2]the end\n[D:1]Hold your br[Cm:2]eath and count to ten\n[#F:1]');
	});

});





describe("Update chord with structured model", function() {

	it("1 line lyric with 1 chord , change to 0 chord" , function() {
		songFormatCompiler.setObjBySourceCode("[Cm:2]This is the end\n");
		var mockObj = 
		[
			[
				null
			]	
		];
		songFormatCompiler.updateChord(mockObj);		
		expect(songFormatCompiler.getSourceCode()).toBe('This is the end');
	});

	it("3 line lyric with 7 chord , change to 1 chord in frist and following is empty" , function() {
		songFormatCompiler.setObjBySourceCode("[D:1]There's a [Em:2]fire starting in my heart,\n[G:1]Reaching a fever pi[Em:1]tch and it's brin[G:2]ging me out the dark\n[Am:2]Finally, I can [Em:2]see you crystal clear.\n");
		var mockObj = 
		[
			[
				{chordName: "Em" , chordDuration: 3 , chordPosition : 0 }
			]			
		];
		songFormatCompiler.updateChord(mockObj);		
		expect(songFormatCompiler.getSourceCode()).toBe("[Em:3]There's a fire starting in my heart,\nReaching a fever pitch and it's bringing me out the dark\nFinally, I can see you crystal clear.");
	});

	it("1 line lyric with 1 chord , change to 2 chord" , function() {
		songFormatCompiler.setObjBySourceCode("[Cm:2]This is the end\n");
		var mockObj = 
		[
			[
				{chordName: "Am" , chordDuration: 2 , chordPosition : 0 },
				{chordName: "G"  , chordDuration: 2 , chordPosition : 8 }
			]			
		];
		songFormatCompiler.updateChord(mockObj);		
		expect(songFormatCompiler.getSourceCode()).toBe('[Am:2]This is [G:2]the end');
	});

	it("1 line lyric with 1 chord , change to 3 chord" , function() {
		songFormatCompiler.setObjBySourceCode("[Cm:2]This is the end\n");
		var mockObj = 
		[
			[
				{chordName: "Am" , chordDuration: 2 , chordPosition : 0 },
				{chordName: "G"  , chordDuration: 2 , chordPosition : 8 },
				{chordName: "D" , chordDuration: 1 , chordPosition : 18 }
			]			
		];
		songFormatCompiler.updateChord(mockObj);		
		expect(songFormatCompiler.getSourceCode()).toBe('[Am:2]This is [G:2]the end[D:1]');
	});


	it("1 line lyric with 1 chord , change to 2 line with 2 chord" , function() {
		songFormatCompiler.setObjBySourceCode("[Cm:2]This is the end\n");		
		var mockObj = 
		[
			[
				{chordName: "Am" , chordDuration: 2 , chordPosition : 0 },
				{chordName: "G"  , chordDuration: 2 , chordPosition : 8 }
			],
			[
				{chordName: "D"  , chordDuration: 1 , chordPosition : 0 },
				{chordName: "Cm" , chordDuration: 2 , chordPosition : 12 }
			]
		];
		songFormatCompiler.updateChord(mockObj);		
		expect(songFormatCompiler.getSourceCode()).toBe('[Am:2]This is [G:2]the end\n[D:1][Cm:2]');
	});


	it("1 line lyric with 3 chord , change to 0 chord" , function() {
		songFormatCompiler.setObjBySourceCode("[Cm:2]This [Dm:1]is th[G:1]e end\n");		
		var mockObj = 
		[
			[
				null
			]			
		];
		songFormatCompiler.updateChord(mockObj);		
		expect(songFormatCompiler.getSourceCode()).toBe('This is the end');
	});

	it("1 line lyric with 3 chord , change to 1 chord" , function() {
		songFormatCompiler.setObjBySourceCode("[Cm:2]This [Dm:1]is th[G:1]e end\n");		
		var mockObj = 
		[
			[
				{chordName: "Am" , chordDuration: 2 , chordPosition : 0 },				
			]			
		];
		songFormatCompiler.updateChord(mockObj);		
		expect(songFormatCompiler.getSourceCode()).toBe('[Am:2]This is the end');
	});

	it("1 line lyric with 3 chord , change to 2 chord" , function() {
		songFormatCompiler.setObjBySourceCode("[Cm:2]This [Dm:1]is th[G:1]e end\n");		
		var mockObj = 
		[
			[
				{chordName: "Am" , chordDuration: 2 , chordPosition : 0 },
				{chordName: "G"  , chordDuration: 2 , chordPosition : 8 }
			]			
		];
		songFormatCompiler.updateChord(mockObj);		
		expect(songFormatCompiler.getSourceCode()).toBe('[Am:2]This is [G:2]the end');
	});


	it("2 line lyric with 4 chord , change to 0 chord" , function() {
		songFormatCompiler.setObjBySourceCode("[Am:2]This is [G:2]the end\n[D:1]Hold your br[Cm:2]eath and count to ten");		
		var mockObj = 
		[
			[
				null
			]			
		];
		songFormatCompiler.updateChord(mockObj);		
		expect(songFormatCompiler.getSourceCode()).toBe('This is the end\nHold your breath and count to ten');
	});

	it("2 line lyric with 4 chord , line 1 & 2 change to 0 chord" , function() {
		songFormatCompiler.setObjBySourceCode("[Am:2]This is [G:2]the end\n[D:1]Hold your br[Cm:2]eath and count to ten");		
		var mockObj = 
		[
			[
				null
			],
			[
				null
			]
		];
		songFormatCompiler.updateChord(mockObj);
		expect(songFormatCompiler.getSourceCode()).toBe('This is the end\nHold your breath and count to ten');
	});

	it("delete 1 chord on empty line" , function() {
		songFormatCompiler.setObjBySourceCode("[B:1]\n心[B:1]變成了軟綿綿 可以壓碎[Em:1]\n");
		var mockObj = [
			[],
			[
				{chordName: "B" , chordDuration: 1 , chordPosition : 1 },
				{chordName: "Em" , chordDuration: 1 , chordPosition : 22 }
			]
		]		
		songFormatCompiler.updateChord(mockObj);
		expect(songFormatCompiler.getSourceCode()).toBe('\n心[B:1]變成了軟綿綿 可以壓碎[Em:1]');
	});

	

});


describe("Real Case", function() {


	it("self consistency -- update plain lyric" , function(){
		songFormatCompiler.setObjBySourceCode("不管愛幾回 都流淚\n[F:1]不想要拒絕 讓我飛[Cm:1]\n\n\n[B:1]\n心[B:1]變成了軟綿綿 可以壓碎[Em:1]\n就算我全身都化成了煙灰我不後悔\n");		
		songFormatCompiler.updateLyric(songFormatCompiler.getPlainLyric());
		expect(songFormatCompiler.getPlainLyric()).toBe('不管愛幾回 都流淚\n不想要拒絕 讓我飛\n\n\n\n心變成了軟綿綿 可以壓碎\n就算我全身都化成了煙灰我不後悔');
		expect(songFormatCompiler.getSourceCode()).toBe("不管愛幾回 都流淚\n[F:1]不想要拒絕 讓我飛[Cm:1]\n\n\n[B:1]\n心[B:1]變成了軟綿綿 可以壓碎[Em:1]\n就算我全身都化成了煙灰我不後悔");
	});

	it("self consistency -- update chord object" , function(){
		songFormatCompiler.setObjBySourceCode("不管愛幾回 都流淚\n[F:1]不想要拒絕 讓我飛[Cm:1]\n\n\n[B:1]\n心[B:1]變成了軟綿綿 可以壓碎[Em:1]\n就算我全身都化成了煙灰我不後悔\n");		
		var chordObj = songFormatCompiler.getChordObjArray();
		var lineNo = songFormatCompiler.getSongModel().length + 1;		
		var ChordObjlength = chordObj.length;
		var updateChordObj = [];
		var lineObj = [];	
		for(var i = 0 ; i < lineNo ; i++){
			lineObj = [];
			for(var j =0 ; j < ChordObjlength ; j++){
				var chordObjItem = chordObj[j];				
				if(i === chordObjItem.chordLine){					
					lineObj.push({chordDuration : chordObjItem.chordDuration , chordName : chordObjItem.chordName, chordPosition : chordObjItem.chordPosition});
				}
			}
			updateChordObj.push(lineObj);
		}		
		songFormatCompiler.updateChord(updateChordObj);
		expect(songFormatCompiler.getPlainLyric()).toBe('不管愛幾回 都流淚\n不想要拒絕 讓我飛\n\n\n\n心變成了軟綿綿 可以壓碎\n就算我全身都化成了煙灰我不後悔\n');
		expect(songFormatCompiler.getSourceCode()).toBe("不管愛幾回 都流淚\n[F:1]不想要拒絕 讓我飛[Cm:1]\n\n\n[B:1]\n心[B:1]變成了軟綿綿 可以壓碎[Em:1]\n就算我全身都化成了煙灰我不後悔\n");
	})

	it("case 1 , get plain text" , function() {
		songFormatCompiler.setObjBySourceCode("不管愛幾回 都流淚\n[F:1]不想要拒絕 讓我飛[Cm:1]\n\n\n[B:1]\n心[B:1]變成了軟綿綿 可以壓碎[Em:1]\n就算我全身都化成了煙灰我不後悔\n");
		expect(songFormatCompiler.getPlainLyric()).toBe('不管愛幾回 都流淚\n不想要拒絕 讓我飛\n\n\n\n心變成了軟綿綿 可以壓碎\n就算我全身都化成了煙灰我不後悔');
	});
	
	it("case 2 , update chord object" , function() {
		songFormatCompiler.setObjBySourceCode("讓我將妳心兒摘下讓我將妳心兒摘下讓我將妳心兒摘下");
		var mockObj = [			
			[
				{chordName: "Am" , chordDuration: 1 , chordPosition : 0 },
				{chordName: "Cm" , chordDuration: 1 , chordPosition : 18 },
				{chordName: "Em" , chordDuration: 1 , chordPosition : 36 },
				{chordName: "B" , chordDuration: 1 , chordPosition : 55 },
			]
		]		
		songFormatCompiler.updateChord(mockObj);
		expect(songFormatCompiler.getSourceCode()).toBe('[Am:1]讓我將妳心兒摘下讓[Cm:1]我將妳心兒摘下讓我[Em:1]將妳心兒摘下[B:1]');
	});	


});





