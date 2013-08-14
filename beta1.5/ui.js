/*-----------------------
Registrador de pontuacao
--------------------- */

var ScoreObject = me.HUD_Item.extend({
    init: function(x, y) {
        
        this.parent(x, y);
        // cria uma fonte
        this.font = new me.BitmapFont("kromasky_16x16", 16);
        //this.font.set("left");
    },
 
    /* --------------------
    desenha o registrador
    ---------------------- */
    draw: function(context, x, y) {
		this.font.draw (context, "PONTOS: ", this.pos.x + x - 32, this.pos.y + y);
        this.font.draw(context, this.value, this.pos.x + x, this.pos.y + y );
    }
    
});


/*--------------
Nivel de resistencia
--------------------- */

var HUDLifebject = me.HUD_Item.extend(
	{	
		init:function(x, y, val)
		{
			this.parent(x, y, val);
			this.maxhp = val;
		},
		
		// update the item value
		update : function(value) {
			
			this.set((this.value + value).clamp(0, this.maxhp));
			return true;
		},
	
		draw : function (context, x, y)
		{
			
			var hp = Math.round((this.value / this.maxhp ) * 280);
			
			// desenha o contorno da barra de resistencia
			context.strokeStyle = "rgba(255,255,255, 0.9)";
			context.strokeRect(this.pos.x+x, this.pos.y+y, 280, 20);
			
			if (hp > 90) {
				// verde
				context.fillStyle = "rgba(0,200,0, 0.9)";
			}
			else if (hp > 50) {
				// laranja
				context.fillStyle = "rgba(255,165,0, 0.9)";
			}
			else  {
				// vermelho
				context.fillStyle = "rgba(255,69,0, 0.9)";
			}
			
			// desenha o preenchimento da barra de resistencia
			context.fillRect(this.pos.x+x+1, this.pos.y+y + 1, hp -2, 18);
			
			var cerebro = me.loader.getImage("cerebro-nq8");       
			context.drawImage(cerebro, this.pos.x -70, this.pos.y -8 ); 
			
		}
});
