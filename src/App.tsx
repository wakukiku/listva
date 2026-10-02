import { useState } from "react";
import {
  useShop,
  useCatalog,
  Loading,
  CartButton,
  ShopOverlays,
  Footer,
  Filters,
  EmptyResults,
  Image,
  money,
} from "./core";
import { matchPlants } from "./domain.mjs";
export default function App() {
  const shop = useShop("listva");
  const filter = useCatalog(shop.catalog?.products || []);
  const [light, setLight] = useState("medium"),
    [care, setCare] = useState("easy"),
    [pets, setPets] = useState(false),
    [match, setMatch] = useState(false);
  if (!shop.catalog) return <Loading shop={shop} />;
  const result = matchPlants(shop.catalog.products, { light, care, pets });
  const visible = match
    ? filter.filtered.filter((p) => result.some((r) => r.id === p.id))
    : filter.filtered;
  return (
    <div id="top">
      <a href="#catalog" className="skip">
        К растениям
      </a>
      <header>
        <a href="#top" className="wordmark">
          листва<span>↟</span>
        </a>
        <nav>
          <a href="#catalog">Растения</a>
          <a href="#match">Подобрать своё</a>
        </nav>
        <CartButton shop={shop} />
      </header>
      <main>
        <section className="greenhouse">
          <img src="assets/hero.jpg" alt="Зелёное растение на светлой стене" />
          <div className="greenhouse-copy">
            <span className="eyebrow">МАЛЕНЬКИЕ ПЕРЕМЕНЫ</span>
            <h1>
              Дома станет
              <br />
              <span>живее.</span>
            </h1>
            <p>
              Зелёные соседи.
              <br />
              Найдём тех, с кем вы поладите.
            </p>
            <a className="primary" href="#catalog">
              Выбрать растение <span>↗</span>
            </a>
          </div>
          <div className="plant-caption">
            <span>В каждом доме</span>
            <b>есть место природе.</b>
          </div>
        </section>
        <section className="plant-match" id="match">
          <div className="match-intro">
            <span className="eyebrow">НАЙДИТЕ СВОЁ</span>
            <h2>
              У каждого дома
              <br />
              свой свет.
            </h2>
            <p>Три ответа — и подходящие растения уже в каталоге.</p>
          </div>
          <div className="match-form">
            <fieldset>
              <legend>Сколько света?</legend>
              {[
                ["low", "Немного"],
                ["medium", "Рассеянный"],
              ].map(([v, label]) => (
                <button
                  key={v}
                  aria-pressed={light === v}
                  className={light === v ? "selected" : ""}
                  onClick={() => {
                    setLight(v);
                    setMatch(false);
                  }}
                >
                  {label}
                </button>
              ))}
            </fieldset>
            <fieldset>
              <legend>Как часто готовы ухаживать?</legend>
              {[
                ["easy", "Иногда забываю"],
                ["medium", "Есть время"],
              ].map(([v, label]) => (
                <button
                  key={v}
                  aria-pressed={care === v}
                  className={care === v ? "selected" : ""}
                  onClick={() => {
                    setCare(v);
                    setMatch(false);
                  }}
                >
                  {label}
                </button>
              ))}
            </fieldset>
            <label className="pet-check">
              <input
                type="checkbox"
                checked={pets}
                onChange={(e) => {
                  setPets(e.target.checked);
                  setMatch(false);
                }}
              />
              <span>Дома есть питомец</span>
            </label>
            <button
              className="primary"
              onClick={() => {
                setMatch(true);
                document
                  .getElementById("catalog")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Показать подходящие <span>{result.length}</span>
            </button>
          </div>
        </section>
        <section className="catalog" id="catalog">
          <div className="section-heading">
            <div>
              <span className="eyebrow">ЗЕЛЁНАЯ КОЛЛЕКЦИЯ</span>
              <h2>{match ? "Ваши будущие соседи." : "Кого поселим дома?"}</h2>
            </div>
            <span>
              {match
                ? `${result.length} по вашим условиям`
                : "От маленького листа к большим переменам"}
            </span>
          </div>
          {match && (
            <div className="match-notice">
              <span>Подбор включён</span>
              <button onClick={() => setMatch(false)}>
                Показать все растения ×
              </button>
            </div>
          )}
          <Filters state={filter} />
          <div className="products">
            {visible.map((p) => (
              <article key={p.id}>
                <button
                  className="product-photo"
                  onClick={() => shop.setDetail(p)}
                  aria-label={`Подробнее: ${p.name}`}
                >
                  <Image p={p} />
                  <span>
                    {p.care === "easy" ? "Простой уход" : "Любит внимание"}
                  </span>
                </button>
                <div className="plant-info">
                  <button
                    className="product-name"
                    onClick={() => shop.setDetail(p)}
                  >
                    {p.name}
                  </button>
                  <p>{p.subtitle}</p>
                  <div className="plant-tags">
                    <span>
                      {p.light === "low" ? "Мягкая тень" : "Рассеянный свет"}
                    </span>
                    {p.pet && <span>С питомцами</span>}
                  </div>
                  <div className="buy-row">
                    <b>{money(p.price)}</b>
                    <button
                      aria-label={`Добавить ${p.name}`}
                      onClick={() => shop.add(p)}
                    >
                      Поселить дома <span>+</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
            {!visible.length && <EmptyResults />}
          </div>
        </section>
        <aside className="care-note">
          <span>↟</span>
          <h2>
            Немного света.
            <br />
            Немного заботы.
          </h2>
          <p>К каждому растению — краткая карточка ухода в описании товара.</p>
        </aside>
      </main>
      <Footer shop={shop} />
      <ShopOverlays
        shop={shop}
        renderDetail={(p) => (
          <>
            <p className="care-instructions">
              {p.light === "low"
                ? "Место без прямых лучей, с мягким дневным светом."
                : "Яркий рассеянный свет, без полуденного солнца."}{" "}
              Проверяйте влажность грунта перед поливом.
            </p>
            <button className="primary" onClick={() => shop.add(p)}>
              Поселить дома <span>+</span>
            </button>
          </>
        )}
      />
    </div>
  );
}
