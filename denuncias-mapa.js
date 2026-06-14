const TIPO_CONFIG = {
  "Esgoto a céu aberto":           { color: "#8b134f", label: "Esgoto a céu aberto"           },
  "Descarte irregular":             { color: "#247e81", label: "Descarte irregular"             },
  "Poluição do ar":           { color: "#9c9e1f", label: "Poluição do ar"           },
};

const BAIRROS_COORDS = {
  "Centro":                 [-30.0277, -51.2287],
  "Centro Histórico":       [-30.0347, -51.2167],
  "Cidade Baixa":           [-30.0450, -51.2200],
  "Humaitá":                [-30.0039, -51.2217],
  "Restinga":               [-30.1519, -51.1400],
  "Sarandi":                [-29.9828, -51.1681],
};

let camadaDenuncias = [];

function limparDenunciasNoMapa(map) {
  camadaDenuncias.forEach(layer => map.removeLayer(layer));
  camadaDenuncias = [];
}

function renderizarDenunciasNoMapa(map) {
  limparDenunciasNoMapa(map);

  const denuncias = JSON.parse(localStorage.getItem('todasDenuncias')) || [];
  if (denuncias.length === 0) return;

  const grupos = {};
  denuncias.forEach(d => {
    const chave = `${d.bairro}||${d.tipo}`;
    if (!grupos[chave]) {
      grupos[chave] = { bairro: d.bairro, tipo: d.tipo, count: 0, items: [] };
    }
    grupos[chave].count++;
    grupos[chave].items.push(d);
  });

  Object.values(grupos).forEach((grupo, idx) => {
    const [lat, lng] = BAIRROS_COORDS[grupo.bairro];
    const config = TIPO_CONFIG[grupo.tipo] || { color: "#000000", label: grupo.tipo };

    const offsetLat = (idx % 3 - 1) * 0.003;
    const offsetLng = (Math.floor(idx / 3) % 3 - 1) * 0.003;

    const raio = Math.min(300 + grupo.count * 80, 900);

    const circulo = L.circle([lat + offsetLat, lng + offsetLng], {
      radius: raio,
      color: config.color,
      fillColor: config.color,
      fillOpacity: 0.35,
      weight: 2,
    });

    const listaEnderecos = grupo.items
      .map(d => `<li style="margin:2px 0">📍 ${d.endereco}</li>`)
      .join('');

    circulo.bindTooltip(
      `<b style="color:${config.color}">${config.label}</b> — ${grupo.bairro}<br>
       <span style="font-size:12px">${grupo.count} ocorrência(s)</span>`,
      { direction: 'top', sticky: true }
    );

    circulo.bindPopup(`
      <div style="min-width:180px; font-family:sans-serif; font-size:13px">
        <p style="margin:0 0 6px;font-weight:600;color:${config.color};font-size:14px">
          ${config.label}
        </p>
        <p style="margin:0 0 4px;color:#444">
          <b>Bairro:</b> ${grupo.bairro}
        </p>
        <p style="margin:0 0 6px;color:#444">
          <b>Ocorrências:</b> ${grupo.count}
        </p>
        <ul style="margin:0;padding-left:16px;color:#555">${listaEnderecos}</ul>
      </div>
    `);

    circulo.addTo(map);
    camadaDenuncias.push(circulo);
  });
}