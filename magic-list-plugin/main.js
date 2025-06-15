const { Plugin } = require("obsidian");

module.exports = class MagicListPlugin extends Plugin {
    async onload() {

            // カードリストを作る処理
            this.registerMarkdownCodeBlockProcessor("mtg-list", async (source, el, ctx) => {
            const lines = source.trim().split('\n');
            let currentSection = "List"; // 最初から "List" セクションとして扱う
            let currentCards = [];
            const sections = [];

            // 『メインボード:』のような書き方を探して1つのセクションと数える
            for (const line of lines) {
                const sectionHeaderMatch = line.match(/^(.+?)[：:]$/);
                if (sectionHeaderMatch) {

                    // 前のセクションを保存
                    if (currentCards.length > 0) {
                        sections.push({ title: currentSection, cards: currentCards });
                    }

                    // 新しいセクション開始
                    currentSection = sectionHeaderMatch[1];
                    currentCards = [];
                } else {
                    const match = line.match(/^(\d+)\s+(.+)$/);
                    if (match) {
                        currentCards.push({
                            count: parseInt(match[1]),
                            name: match[2]
                        });
                    }
                }
            }

            // 最後のセクションも保存
            if (currentCards.length > 0) {
                sections.push({ title: currentSection, cards: currentCards });
            }

            // 全体をラップするコンテナを作成（スクロール対象）
            const container = document.createElement('div');
            container.className = 'magic-card-container';
            el.appendChild(container);
            
            // セクションごとに描画
            for (const section of sections) {
                // 合計枚数を計算
                const totalCount = section.cards.reduce((sum, card) => sum + card.count, 0);

                const sectionHeader = document.createElement('h3');
                sectionHeader.textContent = `${section.title} : ${totalCount}`;
                container.appendChild(sectionHeader);

                const grid = document.createElement('div');
                grid.className = 'magic-card-grid';
                container.appendChild(grid);

                for (const { count, name } of section.cards) {
                    const imageUrl = await fetchCardImage(name);
                    if (!imageUrl) continue;

                    const item = document.createElement('div');
                    item.className = 'magic-card-item';

                    const badge = document.createElement('div');
                    badge.className = 'magic-card-count';
                    badge.textContent = `${count}x`;

                    const img = document.createElement('img');
                    img.src = imageUrl;
                    img.alt = name;

                    item.appendChild(badge);
                    item.appendChild(img);
                    grid.appendChild(item);
                }
            }
        });

        // mtg-cardコードブロック内の複数カードを横並びで表示
        this.registerMarkdownCodeBlockProcessor("mtg-card", async (source, el, ctx) => {
        const cardNames = source.trim().split('\n').map(line => line.trim()).filter(line => line.length > 0);
        el.empty();

        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.gap = '10px';
        container.style.flexWrap = 'wrap';
        container.style.justifyContent = 'flex-start';
        container.style.alignItems = 'flex-start';
        container.style.alignContent = 'flex-start';
        el.appendChild(container);

        for (const cardName of cardNames) {
            const imageUrl = await fetchCardImage(cardName);
            if (!imageUrl) {
            const errorMsg = document.createElement('div');
            errorMsg.textContent = `カード画像が見つかりません: ${cardName}`;
            errorMsg.style.color = 'red';
            container.appendChild(errorMsg);
            continue;
            }

            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = cardName;
            img.style.width = '200px';
            img.style.height = 'auto';
            img.style.border = '1px solid #ccc';
            img.style.borderRadius = '4px';
            img.style.margin = '0';
            container.appendChild(img);
        }
        });
    }

    onunload() {
        console.log("MTG List Plugin unloaded");
    }
};

// カードを探す
async function fetchCardImage(name) {
    // 日本語カードを優先取得
    const resJa = await fetch(`https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(name)}&lang=ja`);
    if (resJa.ok) {
        const data = await resJa.json();
        if (data.image_uris?.normal) {
            return data.image_uris.normal;
        }
    }

    // 日本語がなければ英語カードを取得
    const resEn = await fetch(`https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(name)}&lang=en`);
    if (resEn.ok) {
        const data = await resEn.json();
        return data.image_uris?.normal || null;
    }

    return null;
}
