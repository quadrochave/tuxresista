/* ---------------------------------------------------------------
cria uma entidade jogador 
----------------------------------------------------------------*/

var Jogador = me.ObjectEntity.extend({
 
    // fun��o construtora
    init: function(x, y, settings) {
		
	//settings.image = "sprite_tux-nq8";
	//settings.spritewidth = 48;
		//settings.spriteheight = 48;
		
        // chama o construtor pai
        this.parent(x, y, settings);
        
        // adiciona as posi��es de movimento de acordo com a matriz do sprite
        this.addAnimation ( "andando", [0,1,2,3,4] );
        this.addAnimation ( "escorregando", [8] );
        this.addAnimation ( "pulando", [5] );
        this.addAnimation ( "caindo", [6] );
        this.addAnimation ( "parado", [6,7] );
        this.addAnimation ( "correndo_invencivel", [9,10,11,] );
        this.addAnimation ( "pulando_invencivel", [13] );
        this.addAnimation ( "parado_invencivel", [9] );   
               
 
        // configura a velocidade de caminhada e pulo
        this.setVelocity(3, 15);

	// configura velocidade de aceleracao e o valor limite da aceleracao
        this.aceleracao = 2;
        this.velMax = 5;
        
        // ajusta a �rea de colis�o
	this.updateColRect(1,48, -1);
		
	this.resize(1.4);
		
	this.scale.mult = 1;
				
        //configura a tela para acompanhar a posi��o do jogador
        me.game.viewport.follow(this);
    
 
    },
 
    //atualiza a posi��o do jogador
	update: function() {
		
	   if (me.input.isKeyPressed('right'))
            {
		// Enquanto a velocidade de acelera�ao for menor do que a velocidade maxima, fa�a um incremento da velocidade
                while(this.aceleracao < this.velMax)       
                      this.setVelocity(this.aceleracao++, 15);
                this.flipX(false);         
            }
            else if (me.input.isKeyPressed('left'))
            {
                while(this.aceleracao >- this.velMax)
                     this.aceleracao--;
                this.flipX(true);
            }

	   // Se nem a tecla seta direita nem a tecla seta esquerda estiverem pressionadas, o Tux estara escorregando
            else if (!me.input.isKeyPressed('left') && !me.input.isKeyPressed('right')) {
		if (this.aceleracao > 0) {
		    this.isCurrentAnimation("escorregando");
		    // diminui a velocidade ate parar definindo decremento de 0.15
                    this.aceleracao -= 0.15;
				}
                else if(this.aceleracao < 0) {
                    this.aceleracao += 0.1;
				}
                if(this.aceleracao > -1 && this.aceleracao < 1)
                    this.aceleracao = 0;
            }

	    if (me.input.isKeyPressed('jump'))
            {
                if (!this.jumping && !this.falling)
                {	
	            this.doJump();
                    this.setCurrentAnimation('pulando');
                    me.audio.play("jump");
                }
            }

            this.vel.x = this.aceleracao;

	    // altera a velocidade de anima�ao do sprite de acordo com a aceleracao
            this.animationspeed = me.sys.fps / (5*Math.abs(this.aceleracao)) ;

 	    if(this.vel.y != 0) {
		if ( this.jumping ) 
			this.setCurrentAnimation('pulando');
		else 
			this.setCurrentAnimation('caindo');
	    }	 
            // se a velociddade de y for igual a 0:
            // contanto que a velocidade de x for 0, entao, o Tux esta parado
            // se a velocidade de y nao for zero, o Tux esta andando
            if(this.vel.y == 0) {
		if (this.vel.x == 0 )
			this.setCurrentAnimation('parado');
		else 
			this.setCurrentAnimation('andando');
            }
		
	    // verifica e atualiza o movimento do jogador
	    this.updateMovement();
		
		
	 
		// verifica�ao de colisao
		var res = me.game.collide(this);
		
		if (res) {
			
			// se colidiu com algum inimigo
			if (res.obj.type == me.game.ENEMY_OBJECT) {
				
				// sacode a tela
				//if ( me.game.HUD.setItemValue("life") < 100.1) {
					me.game.viewport.shake(5,40);
					// clarao na tela
					me.game.viewport.fadeIn("#ffffff", 70);
				//}
				
				// game over ?
				if (me.game.HUD.getItemValue("life") == 0){
					me.game.viewport.fadeIn("#ff00000", 400, function()	{ 
						me.state.pause();
						location.reload(true);
						//me.state.change(me.state.FINISH);
					});
				}
			}	
				
			if (res.obj.type == "itemcoletaveldebian") {
				
				//pausa a trilha que esta tocando
				me.audio.pauseTrack("soundtrack_level1");
				
				//toca uma nova trilha de musica
				me.audio.play("heavy");
				
				//altera a velocidade de caminhada e pulo
				this.setVelocity(5, 19);
				
				//altera o tamanho do sprite
				this.resize(1.7);
				
				// configura o valor do hud 
				me.game.HUD.setItemValue("life", 100.1);
				
				var self = this;
				
				// volta ao estagio normal apos 10 segundos
				setTimeout(function () {
					//primeiro o pinguim ira piscar antes de volra ao seu estagio inicial
					self.flicker(45, function () {
						self.setVelocity(3, 15);
						self.resize(1.4);
						me.audio.stop("heavy");
						me.audio.resumeTrack("soundtrack_level1");
						me.game.HUD.setItemValue("life", 100);
				    });
				}, 10000);

				// a quada quadro atualizado a barra diminui 1 ponto, para fazer a anima�ao dela diminuindo
				//me.game.HUD.updateItemValue("life", -0.1);
						
			}	
		}
		
		// se a posi�ao do jogador for maior do que o tamanho da tela, entao caiu
		if (this.pos.y > 370) 
		{ 
			me.game.remove(this);
			me.game.sort();
			me.game.viewport.fadeIn("#ff00000", 400, function()	{ 
				me.state.pause();
				location.reload(true);
				//me.state.change(me.state.FINISH);
			});
				
		}
		
		// atualiza a anima��o quando necessario
		if (this.vel.x!=0 || this.vel.y!=0) {
			// update objet animation
			this.parent(this);
			return true;
		}
		return false;
	 
	}
 
});


 /*------------------------------------------------
 cria uma entidade generica do tipo item coletavel
---------------------------------------------------*/
var Item = me.CollectableEntity.extend({
    
    init: function(x, y, settings) {
        
        this.parent(x, y, settings);
        
        this.addAnimation ("gira", [0,1,2,3,4,5]);
        this.addAnimation ("fagulhas", [6,7,8]);
        
        this.setCurrentAnimation("gira");      
        
    },
     
    onCollision : function ()
	{		
		    //muda o frame de anima�ao do sprite e depois remove o sprite
		    this.setCurrentAnimation("fagulhas", function() { 
				me.game.remove(this) });
		    
			// atualiza o contador de pontos somando um determinado valor
			me.game.HUD.updateItemValue("score", 50);
			
			if (me.game.HUD.getItemValue("score") == 1000)
			{
				me.state.change(me.state.FINISH,
				me.game.HUD.getItemValue("score"));			
			}

			// toca o som da moeda
			me.audio.play("moeda");
			// faz com que nao seja coletavel novamente
			this.collidable = false;
			// remove o item
			
	} 
		
});

 
/*---------------------------------------------------------
 cria um item ubuntu aproveitando a entidade criada acima
---------------------------------------------------------*/
var ItemColetavelUbuntu = Item.extend({
    
    init: function(x, y, settings) {
        
        this.parent(x, y, settings);
        
        this.type = "itemcoletavelubuntu";
             
    }
			
});

/*---------------------------------------------------------
 cria um item Fedora aproveitando a entidade criada acima
---------------------------------------------------------*/

var ItemColetavelFedora = Item.extend({
    
    init: function(x, y, settings) {
        
        this.parent(x, y, settings);
        
        this.type = "itemcoletavelfedora";    
    }
		
});

/*---------------------------------------------------------
 cria um item DEbian aproveitando a entidade criada acima
---------------------------------------------------------*/

var ItemColetavelDebian = Item.extend({
    
    init: function(x, y, settings) {
        
        this.parent(x, y, settings);
        
        this.type = "itemcoletaveldebian";
        
    }

});
 


/* --------------------------------------------
cria uma entidade do tipo inimigo
------------------------------------------------- */
var InimigoPera = me.ObjectEntity.extend({
    init: function(x, y, settings) {
        // Estes atributos tambem podem ser definidos aqui ao inves de no tiled
        settings.image = "sistema_pera-nq8";
        settings.spritewidth = 48;
        settings.spriteheight = 48;
 
        // chama o construtor pai
        this.parent(x, y, settings);
        
        this.fps = 0;
        this.gravity = 1;
        this.timer = 0;
        
        // faz o objeto cair a partir de uma posi��o aleatoria no limite da area do video
        //this.pos.x = this.vp.pos.x + Math.floor(Math.random() * me.video.getWidth());
        
        //define um angulo 
        this.angle = (Math.random() * 30).degToRad();
        
        //define uma velocidade que muda aleatoriamnete
		this.speed = (Math.random() * 2.0) + 0.5;

        // define como colidivel 
        this.collidable = true;
        // define como objeto inimigo
        this.type = me.game.ENEMY_OBJECT;
        
    }, 
 
    // call by the engine when colliding with another object
    // obj parameter corresponds to the other object (typically the player) touching this one
    onCollision: function(res, obj) {
		if ( me.game.HUD.getItemValue("life") >100 ) {
			this.collidable = false;
		}	else {
			me.game.HUD.updateItemValue("life", -30);	
			me.game.remove(this); 
        }
    },
    

    // manipula�ao do movimento do inimigo
    update: function() {
			
        // fa�a nada se estiver invisivel
        if (!this.visible)
            return false;
            
        this.vel.x = this.speed * Math.sin(this.angle);
        this.vel.y = this.speed * Math.cos(this.angle);
        
      	this.timer += me.timer.tick;
		if (this.timer > 300) {
			
			 me.game.remove(this);
					
		}  
        // verifica e atualiza o movimento
        this.updateMovement();
        
         
        // atualiza a anima��o quando necessario
        if (this.vel.x!=0 || this.vel.y!=0) {
            // atualiza a anima��o do objeto
            this.parent(this);
            return true;
        }
        return false;
    }
    
});


