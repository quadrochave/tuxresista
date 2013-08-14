var jsApp = {
    /* ---
     Inicializa o jsApp - prepara recursos
     --- */
    onload: function() {
 
        // inicializa o video
        if (!me.video.init('jsapp', 640, 360, true, 1.0)) {
            alert("Seu navegador nao suporta o recurso canvas do html5. Atualize seu navegador !");
            return;
        }
 
        // inicializa the "audio"
        me.audio.init("mp3,ogg");
        
        // limita a quantidade de quadros por segundo para 30
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
			me.sys.fps = 30;
		} else {
			me.sys.fps = 60;
		}
		
        // define o arquivos a serem carregados
        me.loader.onload = this.loaded.bind(this);
 
        // set all resources to be loaded
        me.loader.preload(g_resources);
 
        // carrega tudo e exibe a tela de carregar
        me.state.change(me.state.LOADING );
                  
    },
 
    /* ---
     quando tudo estiver pronto, configure, adicione, ative
     --- */
	loaded: function () {
		
	   // define a tela de "Titulos" 
	   me.state.set(me.state.MENU, new TitleScreen());
	   
	   // define a tela de "Fim"
	   me.state.set(me.state.FINISH, new FinishScreen());
	   
	   // define a tela "Play/Ingame"
	   me.state.set(me.state.PLAY, new PlayScreen());
	   
	   // define um efeito de transicao
	   me.state.transition("fade","#ffffff", 200);
		 
	   // adiciona a entidade jogador no conjunto de entidades
	   me.entityPool.add("Tux", Jogador);
	   me.entityPool.add("MoedaUbuntu", ItemColetavelUbuntu);
	   me.entityPool.add("MoedaFedora", ItemColetavelFedora);
	   me.entityPool.add("MoedaDebian", ItemColetavelDebian);
	   me.entityPool.add("SistemaPera", InimigoPera);
	   
				 
	   // ativa o o teclado
	   me.input.bindKey(me.input.KEY.LEFT,  "left");
	   me.input.bindKey(me.input.KEY.RIGHT, "right");
	   me.input.bindKey(me.input.KEY.UP,    "jump", true);
	   
		  
	   //inicia pela tela de menu
	   me.state.change(me.state.MENU);
	} 
};
// jsApp

 
//bootstrap :)
window.onReady(function() {
    jsApp.onload();
});
