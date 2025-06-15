# Obsidian-Magic-List-Plugin
ObsidianでMTGのカードを日本語名、英語名どちらでもリスト表示できるプラグイン

# 導入方法
`.obsidian` > `plugins`の中に`main.js` `manifest.json` `styles.css`を入れる

# 使い方
## デッキリストを作る
### 書き方
![image](https://github.com/user-attachments/assets/6aeb81a7-4c1a-4148-a894-456057fa42d7)<br>

\``` mtg-list <br>
デッキリスト: <br>
1 ラノワールのエルフ <br>
40 森 <br>
10 島 <br>
サイドボード: <br>
1 ショック <br>
1 否認 <br>
\```<br>

### リストを作るためのコードブロック
\``` mtg-list<br>
\```<br>
で囲った場所がデッキリストになります。

### 見出しのつけ方
メインボード: <br>
`好きな言葉:`
の形で見出しをつけれます。`メインボード`、`サイドボード`、`統率者`、`買う予定のカード`などなんでも大丈夫です。
コードブロックの中に見出しが一つもなかったら自動的に`List`と表示されます。
見出しの横にはその見出しでのカード総合枚数が表示されます。

### カードの追加方法
1 ラノワールのエルフ <br>
枚数+半角スペース+カード名(日本語、英語名のどちらか)でカードが追加されます。

## 単体or複数枚カードを並べる
### 書き方
![image](https://github.com/user-attachments/assets/1f9ae604-801b-4bba-acf0-4a8470eaa8fd)

\```mtg-card <br>
\タッサの神託者 <br>
\Demonic Consultation <br>
\``` <br>

### カードを並べるためのコードブロック
\```mtg-card <br>
\``` <br>
で囲った場所にカードを並べれます。

### カードの追加方法
タッサの神託者 <br>
カード名(日本語、英語名のどちらか)を書くだけです。

# 不具合
