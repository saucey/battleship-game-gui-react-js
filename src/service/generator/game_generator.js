import BattlefieldGenerator from "./battlefield_generator";
import CellModel from "../../model/cell_model";
import PlayerModel from "../../model/player_model";
import GameModel from "../../model/game_model";

export default class GameGenerator {
    /**
     * @param {Number} players
     * @param {Number} size
     *
     * @returns {GameModel}
     */
    static generate(players, size) {
        const model = new GameModel();

        for (let i = 0; i < players; i++) {
            const battlefield = BattlefieldGenerator.generate(size);
            const player = new PlayerModel();
            if ((i + 1) === players) {
                player.addSequence(PlayerModel.getHumanFlag())
            }

            battlefield.setPlayer(player);
            model.addBattlefield(battlefield)
        }

        GameGenerator.alterPlayerBattlefield(model);

        return model;
    }

    /**
     * @param {GameModel} model
     */
    static alterPlayerBattlefield(model) {
        const shipCoordinates = ['A1', 'A2', 'A3', 'A5', 'C1', 'C2', 'C5'];
        const deadCoordinates = ['A3', 'A4', 'B1', 'B2', 'B3', 'B4'];

        for (const battlefield of model.getBattlefields()) {
            if (!battlefield.getPlayer().isHumanControlled()) {
                continue;
            }

            const callback = (c, seq) => {
                const cell = battlefield.getCell(c);

                if (undefined !== cell) {
                    cell.addSequence(seq);
                }
            };

            shipCoordinates.forEach((v) => callback(v, CellModel.flags.ship));
            deadCoordinates.forEach((v) => callback(v, CellModel.flags.dead));
        }
    }
}
