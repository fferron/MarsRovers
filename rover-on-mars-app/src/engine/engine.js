export const ValidateMission = (state)=>{

        // Step 1: creates plateau informed 
        if(state.plateau.length === 0)
        {
                var plateauValues = state.plateau_dimension.split(' ');

                state.plateau = CreatePlateau(plateauValues, state);
        }

        var movements = state.movement.split('');

        // Step 2: validates the position informed
        ValidateCoordenates(movements, state);

        // Step 3: moves the rover on the plateau
        MoveRoverOnPlateau(state);
}

function CreatePlateau(plateauValues, state)
{
        if(isNumeric(plateauValues[0]) && isNumeric(plateauValues[1]))
        {
                var lengthX = parseInt(plateauValues[0]);
                var lengthY = parseInt(plateauValues[1]);

                var plateau = Array.from(
                        { length: lengthY }, (_, y) => Array.from(
                                { length: lengthX }, (_, x) => ('')
                        )
                )

                return plateau;
        } 
        else 
        {
                console.log('Houston, we have a problem! Plateau field are invalid values. Please, send a valid plateau!');
                
                state.errors.push('Houston, we have a problem! Plateau field are invalid values. Please, send a valid plateau!');

                return;
        }
}

function MoveRoverOnPlateau(state)
{
        var actualPos = state.actual_position.split(' ');
        
        var row = parseInt(actualPos[0]);
        var col = parseInt(actualPos[1]);
        
        if(inBounds(row, col, state.plateau))
        {
                if(state.plateau[row][col] !== null && state.plateau[row][col] === '')
                {
                        state.plateau[row][col] = state.name;
                } 
                else 
                {
                        console.log(`Houston, we have a problem! We cannot send this rover to the same coordinates of the ${state.plateau[row][col]}. Please, send different movements!`); 

                        state.errors.push(`Houston, we have a problem! We cannot send this rover to the same coordinates of the ${state.plateau[row][col]}. Please, send different movements!`); 

                        return;
                }
        } 
        else 
        {
                console.log('Houston, we have a problem! Rover is out of bounds on the plateau. Please, send valid movements!');

                state.errors.push('Houston, we have a problem! Rover is out of bounds on the plateau. Please, send valid movements!'); 

                return;
        }
}

function ValidateCoordenates(movements, state)
{
        movements.forEach(function (element) {

                switch (element) {
                        case 'L':
                                ValidateDirection(element, state);
                                break;
                        case 'R':
                                ValidateDirection(element, state);
                                break;
                        case 'M':
                                ValidateMovement(state);
                                break;
                        default:
                                console.log('Houston, we have a problem! Movement field is incorrect. Please, send valid movements!');

                                state.errors.push('Houston, we have a problem! Movement field is incorrect. Please, send valid movements!');

                                return;             
                }
        });  
} 

function ValidateDirection(movement, state)
{
        var actualPos = state.actual_position.split(' ');
        
        var direction = actualPos[2];

        switch (direction) {
                case 'N':
                        state.actual_position = state.actual_position.replaceAt(4, (movement === 'L') ? 'W': 'E');

                        break;
                case 'E':
                        state.actual_position = state.actual_position.replaceAt(4, (movement === 'L') ? 'N': 'S');

                        break;
                case 'S':
                        state.actual_position = state.actual_position.replaceAt(4, (movement === 'L') ? 'E': 'W');

                        break;
                case 'W':
                        state.actual_position = state.actual_position.replaceAt(4, (movement === 'L') ? 'S': 'N');

                        break;
                default:
                        console.log('Houston, we have a problem! Actual position field is incorrect. Please, send valid direction: N, E, S and W!')

                        state.errors.push('Houston, we have a problem! Actual position field is incorrect. Please, send valid direction: N, E, S and W!')

                        return;
        }
}

function ValidateMovement(state)
{
        var actualPos = state.actual_position.split(' '); 

        var direction = actualPos[2];

        switch (direction) {
                case 'N':
                        actualPos[1] = parseInt(actualPos[1]) + 1;

                        state.actual_position = actualPos.join(' ');

                        break;
                case 'E':
                        actualPos[0] = parseInt(actualPos[0]) + 1;

                        state.actual_position = actualPos.join(' ');

                        break;
                case 'S':
                        actualPos[1] = parseInt(actualPos[1]) - 1;

                        state.actual_position = actualPos.join(' ');

                        break;
                case 'W':
                        actualPos[0] = parseInt(actualPos[0]) - 1;

                        state.actual_position = actualPos.join(' ');

                        break;
                default:
                        console.log('Houston, we have a problem! Actual position field is incorrect. Please, send valid direction: N, E, S and W!')

                        state.errors.push('Houston, we have a problem! Actual position field is incorrect. Please, send valid direction: N, E, S and W!')

                        return;
        }
}
      
function isNumeric(num)
{
    return !isNaN(num);
}

function inBounds(row, col, array) 
{
        if((row >= 0 && row < array.length) && (col >= 0 && col < array.length))
        {
                return true;
        } 

        return false;
}

String.prototype.replaceAt = function (index, char) 
{
        let a = this.split("");
        a[index] = char;
        return a.join("");
}
