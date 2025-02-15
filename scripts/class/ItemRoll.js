import CharRoll from "./CharRoll.js";
import * as gb from './../gb.js';

export default class ItemRoll extends CharRoll{
    constructor(actor,item){
        super();
        this.actor=actor;
        this.item=item;
        this.data=item.data.data.actions;
        this.actions=this.data.additional;
        
        //this.combatRoll(this.item._id);

        this.addFlavor(item.name);
        this.isItem(item);

        

        /* if (actor.data.type=='vehicle'){
            this.usingVehicle(actor);
            actor=game.actors.get(actor.data.data.driver.id);
            
        } */
      //  console.log(this.item);

    }




    rollAction(actionId){
        let action=this.actions[actionId];


        if (action.type=='skill'){
           
           this.addModifier(action.skillMod,action.name);
           if (action.shotsUsed!==''){
            this.useShots(action.shotsUsed);
            }
            
            let rof=1;
            if (action.rof!==undefined){
               rof=action.rof;
            }

            let skill=this.data.skill;
            if (action.skillOverride){
                skill=action.skillOverride;
            }
            this.addSkillMod();
            
            this.rollSkill(skill,rof);

        } else if (action.type=='damage'){
            this.addModifier(action.dmgMod,action.name);
            let damage=this.item.data.data.damage;            

            if (action.dmgOverride){
                damage=action.dmgOverride;
            } else {
                
                ui.notifications.warn(gb.trans('NoDmgActionDefined'));
                
            }

           

            this.addDmgMod();
            this.rollDamage(damage,'',this.raiseDie());
        }

        
        

        
    }

    raiseDie(){
        let raisedie=6;
        if (this.item.data?.data?.bonusDamageDie){
            raisedie=this.item.data.data.bonusDamageDie;
        }

        return raisedie;
    }

    /// universal mods
    addSkillMod(){
        this.addModifier(this.data.skillMod,gb.trans('ModItem'));
    }

    addDmgMod(){
        this.addModifier(this.data.dmgMod,gb.trans('ModItem'));
    }
    ///

    useTarget(targetid){
        /// set the target for info
        this.usetarget=targetid;
    }

    usePP(extraPP){
        if (this.item.type=='power'){
            let usepp=gb.realInt(this.item.data.data.pp)+gb.realInt(extraPP);
            if (usepp<0){ /// min 0
                usepp=0
            }
            this.useShots(usepp);
        }
    }


    rollBaseSkill(rof=1){

      
        this.addSkillMod();

        
        this.rollSkill(this.data.skill,rof);
        
        
        
    }

    rollBaseDamage(){
        this.addDmgMod();
        let extrainfo='';
        if (this.item.data.data.ap){
            extrainfo+=` (${gb.trans('Ap','SWADE')}: ${this.item.data.data.ap}) `;
        }
        this.rollDamage(this.item.data.data.damage,extrainfo,this.raiseDie());
    }

    
}