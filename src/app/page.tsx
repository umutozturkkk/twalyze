"use client";
import { useState } from "react";
import { tweetMockData } from "@/mocks/tweetMockData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const [tweetUrl, setTweetUrl] = useState("");
  const [result, setResult] = useState<typeof tweetMockData[number] | null>(null);
  const [error, setError] = useState("");

  function validateUrl(url: string) {
    return /^https?:\/\/(www\.)?(twitter|x)\.com\/.+\/status\/[0-9]+/.test(url);
  }

  function handleAnalyze(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!validateUrl(tweetUrl)) {
      setError("Lütfen geçerli bir tweet URL'si girin.");
      setResult(null);
      return;
    }
    // Mock result (pick random from array)
    const mockData = tweetMockData[Math.floor(Math.random() * tweetMockData.length)];

    setResult(mockData);
    setTweetUrl(""); // Aramadan sonra input'u sıfırla
    // Google Sheets'e ekle
    fetch("/api/add-to-sheet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mockData),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!data.success) {
          setError("Google Sheets'e eklenirken hata oluştu: " + (data.error || "Bilinmeyen hata"));
        }
      })
      .catch(() => setError("Google Sheets'e erişilemedi."));
  }

  return (
    <div className="flex flex-col items-center justify-center w-full px-2">
      <h1 className="text-5xl md:text-6xl font-extrabold mb-3 pb-3 text-center leading-tight bg-gradient-to-r from-blue-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg tracking-tight">Twalyze</h1>
      <h2 className="text-lg text-center mb-6 font-semibold bg-gradient-to-r from-slate-200 via-blue-200 to-fuchsia-200 bg-clip-text text-transparent">Yapay Zeka Destekli Tweet Analiz Uygulaması</h2>
      <form
        onSubmit={handleAnalyze}
        className="w-full max-w-lg flex flex-col gap-4 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-2xl"
      >
        <Input
          type="url"
          value={tweetUrl}
          onChange={e => setTweetUrl(e.target.value)}
          placeholder="https://x.com/username/status/123..."
          required
          pattern="https://(twitter|x)\.com/.+/status/[0-9]+"
          className="bg-black/40 border border-white/20 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
        />

        <Button type="submit" className="bg-gradient-to-r from-blue-600 via-fuchsia-500 to-cyan-500 text-white font-bold py-2 rounded-lg shadow-md hover:scale-105 focus:ring-2 focus:ring-blue-400 transition-all">Analiz Et</Button>
        <span className="text-[11px] text-slate-400 mt-1 text-center block">Uyarı: Bu uygulamada gerçek analiz yapılmamaktadır, sadece örnek veriler gösterilmektedir.</span>
        {error && <span className="text-rose-600 text-sm">{error}</span>}
      </form>
      {result && (
        <Card className="mt-8 w-full max-w-lg bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">Analiz Sonucu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2 text-white">
              <div><span className="font-semibold">Kullanıcı:</span> <span>{result.username}</span></div>
              <div><span className="font-semibold">Tweet:</span> <span>{result.content}</span></div>
              <div><span className="font-semibold">Özet:</span> <span>{result.summary}</span></div>
              <div><span className="font-semibold">Duygu:</span> <span className={
  result.sentiment === "Olumlu"
    ? "text-emerald-400 font-bold"
    : result.sentiment === "Olumsuz"
    ? "text-rose-400 font-bold"
    : "text-white font-bold"
}>{result.sentiment}</span></div>
              <div><span className="font-semibold">Zaman:</span> <span>{result.timestamp}</span></div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
