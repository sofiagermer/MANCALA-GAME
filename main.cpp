#include <string>
#include <vector>
#include <iostream>
#include <windows.h>
#include <iomanip>

#define EXIT_CODE 1000
#define fill2(x) setw(2) << setfill('0') << x

#define BLACK 0
#define BLUE 1
#define GREEN 2
#define CYAN 3
#define RED 4
#define MAGENTA 5
#define BROWN 6
#define LIGHTGRAY 7
#define DARKGRAY 8
#define LIGHTBLUE 9
#define LIGHTGREEN 10
#define LIGHTCYAN 11
#define LIGHTRED 12
#define LIGHTMAGENTA 13
#define YELLOW 14
#define WHITE 15


int roundCounter = 0;
int value[12];
int score[2];
bool player1 = true; // true -> player1; false -> player2

using namespace std;

void changeColor(int color) {
    SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), color);
}

void showBoard() {
    system("CLS");
    cout << "\t\t\t\t\tRound " << roundCounter << endl << endl;
    changeColor(WHITE);
    cout << "   P2";
    changeColor(YELLOW);
    cout << "         11         10          9          8          7          6" << endl;
    changeColor(WHITE);
    cout << " ______     ______     ______     ______     ______     ______     ______     ______" << endl;
    cout << "|      |   |      |   |      |   |      |   |      |   |      |   |      |   |      |" << endl;
    cout << "|      |   |  " << fill2(value[11]) <<
         "  |   |  " << fill2(value[10]) <<
         "  |   |  " << fill2(value[9]) <<
         "  |   |  " << fill2(value[8]) <<
         "  |   |  " << fill2(value[7]) <<
         "  |   |  " << fill2(value[6]) <<
         "  |   |      |" << endl;
    cout << "|      |   |______|   |______|   |______|   |______|   |______|   |______|   |      |" << endl;
    cout << "|  " << fill2(score[1]) << "  |    ______     ______     ______     ______     ______     ______    |  " << fill2(score[0]) << "  |" << endl;
    cout << "|      |   |      |   |      |   |      |   |      |   |      |   |      |   |      |" << endl;
    cout << "|      |   |  " << fill2(value[0]) <<
         "  |   |  " << fill2(value[1]) <<
         "  |   |  " << fill2(value[2]) <<
         "  |   |  " << fill2(value[3]) <<
         "  |   |  " << fill2(value[4]) <<
         "  |   |  " << fill2(value[5]) <<
         "  |   |      |" << endl;
    cout << "|______|   |______|   |______|   |______|   |______|   |______|   |______|   |______|" << endl << endl;
    changeColor(LIGHTRED);
    cout << "              0          1          2          3          4          5          ";
    changeColor(WHITE);
    cout << "P1" << endl << endl << endl << endl << endl;
}


bool isPlayersHouse(int input) {
    return player1 ? (5 >= input && input >= 0) : (11 >= input && input >= 6);
}

bool isInputInvalid(int input) {
    if (cin.fail()) return true;

    if (input == EXIT_CODE) return false;

    if (isPlayersHouse(input))
        if (value[input] != 0)
            return false;

    return true;

}

int choosePlace() {
    int var;
    cout << "Player " << (player1 ? 1 : 2) << ", choose one of your houses with seeds." << endl
         << "To forfeit, write the expression inside quotation marks: \"" << EXIT_CODE << "\"" << endl;
    cin >> var;

    while (isInputInvalid(var)){
        cin.clear();
        cin.ignore(1000, '\n');
        cout << "Wrong input." << endl;
        cin >> var;
    }

    return var;
}

void verifyScoring(int finalHouse) {
    while (true) {
        if ((value[finalHouse] == 2 || value[finalHouse] == 3) && (player1 == (finalHouse > 5)) /* either both true of both false is valid*/ ) {
            score[player1 ? 0 : 1] += value[finalHouse];
            value[finalHouse] = 0;
        }
        else break;

        if (finalHouse == 6 || finalHouse == 0) break;
        finalHouse--;
    }
}

void executePlay(int initialHouse) {
    int seeds = value[initialHouse];

    int loops = 0;
    int finalHouse;

    for (int i = initialHouse; i < initialHouse + seeds + loops; i++){
        if (i == initialHouse) loops++;
        value[i % 12]++;
        finalHouse = i % 12;
    }

    value[initialHouse] = 0;

    verifyScoring(finalHouse);
}

bool checkWinner() {
    if (score[0] > 24) {
        cout << "Player 1 wins!" << endl;
        system("pause");
        return true;
    }
    if (score[1] > 24) {
        cout << "Player 2 wins!" << endl;
        system("pause");
        return true;
    }
    if (score[0] == score[1] && score[0] == 24) {
        cout << "Draw!" << endl;
        system("pause");
        return true;
    }
    return false;
}

int main() {
    for (int& i : value)
        i = 4;

    while (true) {
        showBoard();
        if (checkWinner()) return 0;

        int playedHouse = choosePlace();
        if (playedHouse == EXIT_CODE) {

            // After a player forfeits, add the number of seeds of each player's houses to his score
            for (int i = 0; i < 12; i++) {
                i < 6 ? (score[0] += value[i]) : (score[1] += value[i]);
                value[i] = 0;
            }

            showBoard();
            checkWinner();
            return 0;
        }
        executePlay(playedHouse);

        player1 ? player1 = false : player1 = true; // Change player
        roundCounter++;
    }
}
