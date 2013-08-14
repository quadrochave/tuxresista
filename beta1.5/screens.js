/* ------------------
  cria uma tela de fase
--------------------*/
var PlayScreen = me.ScreenObject.extend({
	
    onResetEvent: function() {
		
        // carrega uma fase
        me.levelDirector.loadLevel("area01");  
        
        //toca a trilha da fase 1
        me.audio.playTrack("soundtrack_level1", true); 
        
        // adiciona um elemento HUD padrao no jogo
        me.game.addHUD(0, 20, 640, 60);
 
        // adiciona um item de contagem
        me.game.HUD.addItem("score", new ScoreObject(620, 10));
        
        //  adiciona um item de barra de resistencia (x, y, velocidade)
        me.game.HUD.addItem("life",	 new HUDLifebject	(100, 10, 100));
        
        //  adiciona um item de barra de invencibilidade (x, y, velocidade)
        //me.game.HUD.addItem("invencibilidade",	 new HUDLifebject	(400, 60, 100));
        
        // return the value of the "score" item
		score = me.game.HUD.getItemValue("score");
		
		if (me.game.HUD.getItemValue("score") > 1100)
		{
			me.game.HUD.removeItem("score");
		}

        // adiciona um botao esquerdo na tela para controle do jogador
        //me.game.HUD.addItem("btnleft", new HUD_btn_left(30, 30));
        
        // verifica se tudo esta na ordem correta
        me.game.sort();
        
        
    },
    
    
 
    /* ---
    açao a ser executada quando o jogo e finalizado (state change)
    --- */
    onDestroyEvent: function() {
		me.game.disableHUD();
	    
	    // Desabilita as teclas
		me.input.unbindKey(me.input.KEY.LEFT);
		me.input.unbindKey(me.input.KEY.RIGHT);
		me.input.unbindKey(me.input.KEY.UP);
		me.input.unbindKey(me.input.KEY.DOWN);
		me.input.unbindKey(me.input.KEY.SPACE);
					
		// para de tocar a trilha principal
		me.audio.stopTrack();
	}
 
});



/*----------------------
 cria a tela de titulos
  ----------------------*/
 
var TitleScreen = me.ScreenObject.extend({
    // constructor
    init: function() {
        this.parent(true);
 
        // imagem da tela de titulos
        this.title = null;
 
        this.font = null;
    },
 
    // funçao de reinicializar
    onResetEvent: function() {
        if (this.title == null) {
            
            this.title = me.loader.getImage("menu_principal");
            // font to display the menu items
            this.font = new me.BitmapFont("kromasky_16x16", 16);
            this.font.set("left");
 
        }
  
        // ativa o teclado
        me.input.bindKey(me.input.KEY.ENTER, "enter", true);
 
        // toca a trilha sonora
        me.audio.playTrack("intro", true);
        
    },

    // update function
    update: function() {
        // pressionou a tecla ENTER ?
        if (me.input.isKeyPressed('enter') ) {
            me.state.change(me.state.PLAY);
        }
        return true;
    },
 
    // funçao de desenho
    draw: function(context) {
        context.drawImage(this.title, 0, 0);
 
        this.font.draw(context, "INICIAR", 250, 200);
        
    },
 
    // destroy function
    onDestroyEvent: function() {
		// desativa as teclas porque serao usadas para outras funcoes durante a fase
        me.input.unbindKey(me.input.KEY.ENTER);
        
    }
 
});


var FinishScreen = me.ScreenObject.extend({
    // constructor
    init: function() {
        this.parent(true);
 
        // imagem da tela de titulos
        this.title = null;
 
        this.font = null;
    },
 
    // funçao de reinicializar
    onResetEvent: function() {
        if (this.title == null) {
            
            this.title = me.loader.getImage("menu_principal");
            // font to display the menu items
            this.font = new me.BitmapFont("kromasky_16x16", 16);
            this.font.set("left");
 
        }
  
        // ativa o teclado
        //me.input.bindKey(me.input.KEY.ENTER, "enter", true);
 
        // toca a trilha sonora
        me.audio.playTrack("intro", true);
        
    },

    // update function
    update: function() {
        // pressionou a tecla ENTER ?
        if (me.input.isKeyPressed('enter') ) {
           // me.state.change(me.state.PLAY);
        }
        return true;

    },
 
    // funçao de desenho
    draw: function(context) {
        context.drawImage(this.title, 0, 0);
 
        this.font.draw(context, "VENCEU!!", 245, 200);
                                 
    },
 
    // destroy function
    onDestroyEvent: function() {
		// desativa as teclas porque serao usadas para outras funcoes durante a fase
        me.input.unbindKey(me.input.KEY.ENTER);
        
    }
 
});
