import json, re, time, sys
import http.client

SRV_HOST="127.0.0.1"; SRV_PORT=8012
def ask(msg):
    body=json.dumps({"message": msg}).encode()
    conn=http.client.HTTPConnection(SRV_HOST, SRV_PORT, timeout=30)
    conn.request("POST","/ask", body, {"Content-Type":"application/json"})
    resp=conn.getresponse()
    data=resp.read()
    conn.close()
    if resp.status!=200:
        return {"error": f"HTTP {resp.status}", "raw": data.decode(errors="ignore")}
    try:
        return json.loads(data.decode())
    except:
        return {"error":"bad_json","raw":data.decode(errors="ignore")}

def lead_sentence_count(text):
    # crude split on first paragraph into sentences
    lead=text.strip().split("\n",1)[0]
    parts=re.split(r'(?<=[.!?])\s+', lead)
    return len([p for p in parts if p.strip()])

def main():
    with open("scripts/eval/prompts.jsonl") as f:
        prompts=[json.loads(l) for l in f if l.strip()]
    cfg=json.load(open("scripts/eval/expectations.json"))
    banned=[re.compile(p, re.I) for p in cfg["banned_patterns"]]
    reqmap=cfg["required_facts"]
    failures=[]
    for i,p in enumerate(prompts,1):
        r=ask(p["message"]); time.sleep(0.3)
        ans=r.get("answer","")
        if not ans:
            failures.append((p["id"],"no_answer",r.get("error",r)))
            print(f"[{i}/{len(prompts)}] {p['id']}: FAIL (no answer)")
            continue
        ok=True; reasons=[]
        # length
        if not (cfg["min_chars"]<=len(ans)<=cfg["max_chars"]):
            ok=False; reasons.append(f"length {len(ans)} out of bounds")
        # lead compactness
        if lead_sentence_count(ans)>cfg["max_lead_sentences"]:
            ok=False; reasons.append("too many lead sentences")
        # banned patterns
        for bp in banned:
            if bp.search(ans):
                ok=False; reasons.append(f"banned: {bp.pattern}")
                break
        # required facts
        if p["id"] in reqmap:
            misses=[rf for rf in reqmap[p["id"]] if re.search(re.escape(rf), ans, re.I) is None]
            if misses:
                ok=False; reasons.append("missing required: "+", ".join(misses))
        print(f"[{i}/{len(prompts)}] {p['id']}: {'OK' if ok else 'FAIL'}")
        if not ok:
            failures.append((p["id"],"checks_failed","; ".join(reasons)))
    print("\nSummary:")
    print(f"  total: {len(prompts)}  pass: {len(prompts)-len(failures)}  fail: {len(failures)}")
    if failures:
        for fid,typ,why in failures:
            print(f"  - {fid}: {typ} -> {why}")
        sys.exit(1)

if __name__=="__main__":
    main()
