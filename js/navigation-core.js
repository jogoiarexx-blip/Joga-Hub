/* JogaHub — regras de navegação, categorias e filtros.
 * Mantém a camada DOM no app.js; todas as decisões de busca ficam aqui,
 * independentes do navegador e testáveis no Node.
 */
(function(root){
  'use strict';
  const MEDIA_VIEWS = ['filme','serie','anime'];
  const MEDIA_OPTIONS = [
    ['youtube-curated','▶ YouTube selecionado'],['youtube-pt','🇧🇷 YouTube PT'],
    ['archive-pt','🏛️ Archive PT'],['gratis','🆓 Grátis'],
    ['infantil','🧸 Infantil'],['acao','💥 Ação'],['comedia','😂 Comédia'],
    ['romance','❤️ Romance'],['terror','👻 Terror'],
    ['ficcao','🚀 Ficção científica'],['dec70','🕺 Até 70'],
    ['dec80','📼 Anos 80'],['dec90','📺 Anos 90'],['dec2000','💿 Anos 2000'],
    ['portugues','🇧🇷 Português'],['favoritos','♥ Minha Lista'],['continuar','▶ Continuar']
  ];
  function normalize(value=''){
    return String(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  }
  function filterOptions(view,pool=[],gameCategories={}){
    if(view==='jogo'){
      const categories=[...new Set(pool.map(item=>item.category||'outros'))]
        .sort((a,b)=>(gameCategories[a]?.order||99)-(gameCategories[b]?.order||99));
      return [
        ['todos','🎮 Todos os jogos'],
        ...categories.map(key=>{
          const category=gameCategories[key]||gameCategories.outros||{icon:'🎮',label:'Outros'};
          return [key,category.icon+' '+category.label];
        })
      ];
    }
    if(view==='tv'||view==='emulador'||view==='radio')return [];
    if(MEDIA_VIEWS.includes(view))return [
      ['todos','🍿 Todos'],
      ...(view==='serie'?[['breaking-bad','🧪 Breaking Bad'],['doramas','📱 Doramas curtos']]:[]),
      ...MEDIA_OPTIONS
    ];
    return ['todos',...new Set(pool.map(item=>item.genre))].map(genre=>[genre,genre]);
  }
  function mediaMatches(item,genre,{favorites,itemDecade,movieProgress}){
    switch(genre){
      case 'todos':return true;
      case 'jackie':return item.jackieChan===true;
      case 'youtube-curated':return item.youtubeCurated===true;
      case 'youtube-pt':return item.youtubePt===true||(item.youtubeId&&(item.portuguese||/portugu/i.test(item.language||'')));
      case 'archive-pt':return item.archiveLicensed===true;
      case 'gratis':return !!item.freeLegal;
      case 'classicos-tv':return !!item.classicTv;
      case 'breaking-bad':return item.seriesId==='breaking-bad-drive'||item.seriesId==='breaking-bad'||normalize(item.seriesTitle||'')==='breaking bad';
      case 'doramas':return !!item.dorama;
      case 'infantil':return !!item.kids;
      case 'animes':return !!item.anime;
      case 'luta':return !!item.wrestling;
      case 'acao':return item.filmGenre==='acao'||normalize(item.genre||'').includes('acao');
      case 'comedia':return item.filmGenre==='comedia'||normalize(item.genre||'').includes('comedia');
      case 'romance':return item.filmGenre==='romance'||normalize(item.genre||'').includes('romance');
      case 'terror':return item.filmGenre==='terror'||normalize(item.genre||'').includes('terror');
      case 'ficcao':return item.filmGenre==='ficcao'||normalize(item.genre||'').includes('ficcao');
      case 'dec70':return itemDecade(item)==='70-';
      case 'dec80':return itemDecade(item)==='80';
      case 'dec90':return itemDecade(item)==='90';
      case 'dec2000':return itemDecade(item)==='2000';
      case 'portugues':return !!item.portuguese||/portugu/i.test(item.language||'');
      case 'coloridos':return !!item.colorContent&&(!!item.portuguese||/portugu/i.test(item.language||''));
      case 'series':return item.mediaType==='serie';
      case 'filmes':return item.mediaType!=='serie'&&item.mediaType!=='colecao';
      case 'colecoes':return item.mediaType==='colecao';
      case 'favoritos':return favorites.has(item.id);
      case 'continuar':return !!movieProgress(item);
      default:return false;
    }
  }
  function filterItems(items,{view='todos',genre='todos',term='',favorites=new Set(),searchIndex,contentView,itemDecade,movieProgress}={}){
    const normalized=normalize(String(term).trim());
    const media=MEDIA_VIEWS.includes(view);
    return items.filter(item=>{
      if(view!=='todos'&&contentView(item)!==view)return false;
      if(media){
        if(!mediaMatches(item,genre,{favorites,itemDecade,movieProgress}))return false;
      }else if(genre!=='todos'&&
        (view==='jogo'?(item.category||'outros')!==genre:item.genre!==genre)){
        return false;
      }
      return !normalized||searchIndex(item).includes(normalized);
    });
  }
  function sortByTypeOrder(items,favorites=new Set(),typeOrder=[]){
    return [...items].sort((a,b)=>{
      const favoriteDifference=Number(favorites.has(b.id))-Number(favorites.has(a.id));
      if(favoriteDifference)return favoriteDifference;
      return typeOrder.indexOf(a.type)-typeOrder.indexOf(b.type);
    });
  }
  root.JOGAHUB_NAV_CORE=Object.freeze({normalize,filterOptions,filterItems,sortByTypeOrder});
})(window);
